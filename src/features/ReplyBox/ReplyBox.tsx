import React, {useEffect, useRef, useState} from 'react';
import './ReplyBox.css'
import {AiOutlineCopy} from "react-icons/ai";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Typed from 'react-typed';
import {IResponseData} from "../../interfaces/api";
import Cookies from "js-cookie";
import i18nUtil from "../../util/i18n-util";
import _ from 'lodash'
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {IAppSlice} from "../../store/appSlice";

export interface IReplyBoxProps {
    text: string,
    index: number,
    total: number,
    hasError: number,
    respData?: IResponseData,
    waiting?: boolean
}


const CodeErrUnknown = 1001
const CodeErrNoAccount = 1002
const CodeErrSensitive = 1003
const CodeErrGptError = 1004

const CodeErrParams = 2001
const CodeErrUnAuth = 2002
const CodeErrReachCap = 2003
const CodeErrInvalidRetailAccount = 2004
const CodeErrExpired = 2005

const Code2Msg = {
    [CodeErrNoAccount]: i18nUtil.t('系统临时维护中').toString(),
    [CodeErrGptError]: i18nUtil.t('GPT接口异常').toString(),
    [CodeErrReachCap]: i18nUtil.t('额度用完').toString(),
    [CodeErrExpired]: i18nUtil.t('额度已过期').toString(),
    [CodeErrUnAuth]: i18nUtil.t('无权限').toString(),
    [CodeErrUnknown]: i18nUtil.t('未知错误').toString(),
}

const initWaitingPromptText = i18nUtil.t('机器人正在思考').toString()

export function ReplyBox(props: IReplyBoxProps) {
    const [copied, setCopied] = useState<boolean>(false)
    const [showCursor, setShowCursor] = useState<boolean>(false)
    const [waitingText, setWaitingText] = useState(initWaitingPromptText)
    const app: IAppSlice = useSelector((state: RootState) => state.app)

    const typed = useRef<any>(null)

    let textDom;
    const useTyped = Cookies.get('typed') == '1'
    if (props.waiting) {
        useEffect(() => {
            // console.log('useeffect')
            let cnt = 0
            const counterTimer = setInterval(() => {
                // console.log(counterTimer, 'cnt', cnt)
                setWaitingText(initWaitingPromptText + _.repeat('.', cnt))
                // console.log(initWaitingPromptText + _.repeat('.', cnt))
                cnt++
                cnt %= 7
            }, 200)
            // console.log('setInterval', counterTimer)
            return () => {
                // console.log('clearInterval', counterTimer)
                clearInterval(counterTimer)
            }
        }, [])
        textDom = (
            <p className={`tpl-text`}>
                {waitingText}
            </p>
        )
    } else if (props.hasError) {
        let tips;
        const code = props.respData?.code
        const isNetworkError = !code
        if (isNetworkError || [CodeErrUnknown, CodeErrGptError].includes(code)) {
            tips = (
                <div className={'text-left text-gray-400 text-xs'}>
                    <hr/>
                    {i18nUtil.t('近期访问量过大，建议多试几次，出错不会计入次数，但不要发一模一样的问题，可以加个标点符号或其他词，或者换个问题。')}
                </div>
            )
        }
        textDom = (
            <div>
                <p className={`tpl-text error`}>
                    {code ? Code2Msg[code] : Code2Msg[CodeErrUnknown]}
                </p>
                {tips}
            </div>
        )
    } else if (useTyped && props.index + 1 == props.total && app.loading) { // 打字机效果
        textDom = (
            <p className={`tpl-text`}>
                <Typed
                    strings={[props.text]}
                    showCursor={showCursor}
                    typedRef={(t) => {
                        typed.current = t;
                    }}
                    onComplete={(instance) => {
                        instance.cursor.remove();
                    }}
                    typeSpeed={40}
                />
            </p>
        )
    } else {
        textDom = (
            <p className={`tpl-text`}>
                {props.text}
            </p>
        )
    }
    return (
        <div
            className="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]">
            <div className="text-base gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
                <div className="w-[30px] flex flex-col relative items-end">
                    <div className="relative flex"><span
                        id="span001"><span
                        id="span002"><img
                        alt="" aria-hidden="true"
                        src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2730%27%20height=%2730%27/%3e"
                        id="img001"/></span><img
                        alt="Wynell Digrazia"
                        src="./_next/image/w.jpg"
                        decoding="async" data-nimg="intrinsic" className="rounded-sm"
                        id="img002"
                    /></span>
                    </div>
                </div>
                <div className="relative lg:w-[calc(100%-115px)] w-full flex flex-col">
                    <div className="min-h-[20px] whitespace-pre-wrap flex flex-col items-start gap-4">
                        <div
                            className="request-:R2d6:-0 markdown prose dark:prose-invert break-words light">{textDom}</div>
                    </div>
                    <div
                        className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2"
                    >
                        <button
                            className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 hidden">
                            <svg stroke="currentColor" fill="none" strokeWidth="2"
                                 viewBox="0 0 24 24" strokeLinecap="round"
                                 strokeLinejoin="round" className="w-4 h-4" height="1em"
                                 width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                        </button>
                        <CopyToClipboard text={props.text}
                                         onCopy={() => setCopied(true)}
                                         options={{format: 'text/plain'}}>
                            <button
                                className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400">
                                <svg stroke="currentColor" fill="none" strokeWidth="2"
                                     viewBox="0 0 24 24" strokeLinecap="round"
                                     strokeLinejoin="round" className="w-4 h-4 hidden" height="1em"
                                     width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                                </svg>
                                <AiOutlineCopy></AiOutlineCopy>
                            </button>
                        </CopyToClipboard>
                    </div>
                </div>
            </div>
        </div>
    );
}