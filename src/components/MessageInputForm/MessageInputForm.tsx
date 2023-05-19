import i18nUtil from "../../util/i18n-util";
import React, {useRef, useState} from "react";
import * as _ from 'lodash'
import {
    createChat,
    getChat,
    pushQaItem, selectEnabledStream,
    setCurrentChat, setLoading,
    setShowProductAlert,
    setThink,
    upsertQaItem
} from "../../store/appSlice";
import axios from "axios";
import {AppConfig} from "../../config/app";
import {useDispatch, useSelector} from "react-redux";
import store, {RootState} from "../../store/store";
import {ChatSession, MessageItem} from "../../interfaces/session";
import {getUserSlug} from "../../util/util";
import {newChat} from "../../util/chat";
import {ChatCompletionsResponse} from "../../interfaces/openai";
import {IResponseData} from "../../interfaces/api";
import {sleep} from "../../util/time";

const D_ASK = 1
const D_REPLY = 2

export interface ICheckResponseParams {
    status?: number,
    data?: IResponseData,
    error?: Error
}

export interface IPostStreamParams {
    data: object,
    onData: (data: any) => void,
    onError: (params: ICheckResponseParams) => void
    onDone?: () => void
}

async function postStream({data, onData, onError, onDone}: IPostStreamParams) {
    let dataObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }

    try {
        const response = await fetch(AppConfig.API_ENDPOINT + '/openai/v1/chat/completions', dataObj)
        if (response.ok) {
            // let i = 0
            let msgpack = ''
            let getStream = async function (reader) {
                return reader.read().then(async function (result) {
                    // 如果数据已经读取完毕，直接返回
                    if (result.done) {
                        console.log(889, "result done")
                        onDone?.()
                        return
                    }
                    // 取出本段数据（二进制格式）
                    const pack = new TextDecoder().decode(result.value);
                    let mutilated = false
                    console.log('pack-----------\n', pack)
                    if (!pack.endsWith('\n\n')) {
                        mutilated = true
                    }
                    console.log('multilated-----', mutilated)
                    msgpack += pack
                    const chunks = msgpack.split('\n\n')
                    for (let i = 0; i < chunks.length; i++) {
                        const chunk = chunks[i]
                        console.log('chunk----', chunk)
                        if (i == chunks.length - 1 && mutilated) {
                            msgpack = chunk
                            break
                        }
                        if (!chunk) {
                            continue
                        }
                        if (!chunk.startsWith('event:')) {
                            onError({data: JSON.parse(chunk), status: response.status})
                            return
                        }
                        const chunk1 = chunk.split('\n')[1]
                        const data = JSON.parse(chunk1.slice(5))
                        await onData(data)
                        // i++
                    }
                    if (!mutilated) {
                        msgpack = ''
                    }
                    // 递归处理下一段数据
                    return getStream(reader)
                })
            }
            await getStream(response.body!.getReader())
        } else {
            onError({data: JSON.parse(await response.text()), status: response.status})
        }
    } catch (e: any) {
        onError({error: e})
    }
}

export function MessageInputForm() {
    const textArea = useRef<any>();
    const [ques, setQues] = useState('')
    const [textAreaRows, setTextAreaRows] = useState(1)
    const dispatch = useDispatch()
    const app = useSelector((state: RootState) => state.app)
    const currentChatIdx = useSelector((state: RootState) => state.app.currentChatIdx)
    const chatCnt = useSelector((state: RootState) => state.app.chatCnt)
    const enabledCtx = currentChatIdx >= 0 ? app.chats[currentChatIdx]?.enabledCtx : app.enabledCtx
    const qaList = app.chats[currentChatIdx]?.qaList || []
    const enabledStream = useSelector(selectEnabledStream)

    function handleChange(e) {
        // console.log('handleChange', e)
        // Return if user presses the enter key
        // if (e.nativeEvent.inputType === "insertLineBreak") return;

        setQues(e.target.value)
    }

    async function handleClick(e: React.MouseEvent<any> | null = null) {
        const question = _.trim(ques)
        if (!question) {
            return
        }

        setQues('')
        setTextAreaRows(1)
        const textarea = textArea.current
        textarea.style.height = ''


        let curChat: ChatSession
        let chatId = store.getState().app.currentChat // 闭包内用外部的 currentChat 拿不到最新的值，但在函数外是可以拿到的
        if (!chatId) {
            curChat = newChat(chatCnt + 1)
            curChat.presetPrompt = store.getState().app.presetPrompt
            curChat.enabledCtx = store.getState().app.enabledCtx
            dispatch(createChat(curChat))
            chatId = curChat.id
        }

        addDialog(chatId, D_ASK, question)
        submitQuestion(chatId, question)
    }

    async function handleKeyEventEnter(e: React.KeyboardEvent<any>) {
        // console.log('handleKeyEventEnter', e)
        if (e.key === 'Enter' && !e.shiftKey) {
            await handleClick()
        }
    }

    function addDialog(chatId: string, dtype: number, text: string, hasError = 0, respData: any = undefined) {
        dispatch(pushQaItem({dtype, text, hasError, respData, chatId}))
        setTimeout(() => {
            window['qaContainerTail'].scrollIntoView()
        }, 200)
    }

    function checkResponse(e: { status?: number, data?: IResponseData, error?: any, chatId: string }) {
        let hasError = 0, msg
        if (e.status) {
            const respData = e.data!

            if (e.status == 200) {
                msg = e.data?.data.answer || e.data?.data.content
            } else if (respData.code == 2002 || respData.code == 2003 || respData.code == 2005) {
                dispatch(setShowProductAlert(true))
                hasError = 1
            } else {
                hasError = 1
            }
        } else {
            hasError = 1
        }
        dispatch(setThink(false))
        dispatch(setLoading(false))
        addDialog(e.chatId, D_REPLY, msg, hasError, e.data)
    }

    async function submitQuestion(chatId, question) {
        dispatch(setThink(true))
        dispatch(setLoading(true))

        const msgAry = qaList.filter(e => !e.hasError)
        const messages: MessageItem[] = []
        if (enabledCtx) {
            for (const item of msgAry) {
                const role = item.dtype == D_ASK ? 'user' : 'assistant'
                const content = item.text
                messages.push({role, content})
            }
        }
        messages.push({role: 'user', content: question})

        const lastAry = qaList.filter(e => !e.hasError && e.dtype == D_REPLY).slice(-1)
        if (lastAry.length == 1) {
            if (enabledCtx) {
                question = lastAry[0].text + '\n\n' + question
            }
        }
        let resp, msg, hasError, respData, responseType
        try {
            responseType = enabledStream ? "stream" : 'none'
            let presetPrompt = getChat(store.getState().app)(chatId)!.presetPrompt
            if (presetPrompt?.act == '无预设') {
                presetPrompt = undefined
            }
            const postData = {
                question: question,
                messages,
                slug: getUserSlug(),
                preset_prompt: presetPrompt,
            }
            if (responseType == "stream") {
                await postStream({
                    data: postData,
                    onData: async (data: ChatCompletionsResponse) => {
                        if (!data.choices[0].delta.content) {
                            return
                        }
                        dispatch(setThink(false))
                        for (const char of Array.from(data.choices[0].delta.content)) {
                            dispatch(upsertQaItem({
                                id: data.id,
                                text: char,
                                D_REPLY,
                                hasError,
                                respData,
                                chatId,
                            }))
                            await sleep(50)
                        }
                        setTimeout(() => {
                            window['qaContainerTail'].scrollIntoView()
                        }, 200)
                    }, onError: (e) => {
                        checkResponse({status: e.status, data: e.data, chatId})
                    }, onDone: () => {
                        dispatch(setLoading(false))
                    },
                })
            } else {
                resp = await axios.post(AppConfig.API_ENDPOINT + '/query', postData, {
                    timeout: 2 * 60_000,
                })
                console.log('resp', resp)
                checkResponse({status: resp.status, data: resp.data, chatId})
            }
        } catch (e: any) {
            if (e?.response?.data) {
                checkResponse({status: e.response.status, data: e.response.data, chatId})
            } else {
                checkResponse({error: e, chatId})
            }
        }
    }

    return <form
        className="flex flex-row stretch gap-3 mx-2 lg:mx-auto pt-2 lg:pt-6 lg:max-w-3xl last:mb-2 md:last:mb-6"
        id="inputForm">
        <div className="relative flex-1 h-full flex flex-col">
            <div className="w-full flex gap-2 justify-center mb-3"></div>
            <div
                className="flex flex-col w-full py-2 pl-3 md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
                style={{backgroundColor: app.loading ? '#eee' : '', cursor: app.loading ? 'wait' : ''}}
            >
                <textarea tabIndex={0}
                          data-id="root"
                          id="inputArea"
                          style={{maxHeight: '200px', overflowY: 'hidden', cursor: app.loading ? 'wait' : ''}}
                          rows={textAreaRows}
                          placeholder={i18nUtil.t("在此输入问题，Shift + Enter 换行，Enter 发送") || ''}
                          name='question'
                          value={ques}
                          onChange={e => {
                              const textarea = textArea.current
                              textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
                              handleChange(e)
                          }}
                          onKeyUp={(e) => {
                              // 屏蔽 Enter 键，防止插入 \n
                              if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault()
                              }
                          }}
                          onKeyDown={(e) => {
                              // 屏蔽 Enter 键，防止插入 \n
                              if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault()
                              }
                              handleKeyEventEnter(e)
                          }}
                          ref={textArea}
                          className="w-full resize-none focus:ring-0 focus-visible:ring-0 p-0 pr-7 m-0 border-0 bg-transparent dark:bg-transparent"
                          disabled={app.loading}
                >

                </textarea>
                <button
                    onClick={(e) => handleClick(e)}
                    type="button"
                    className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
                         viewBox="0 0 20 20"
                         className="w-4 h-4 rotate-90" height="1em" width="1em"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </form>
}