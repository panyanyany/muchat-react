import {createSlice, PayloadAction, SliceCaseReducers} from "@reduxjs/toolkit";
import {ChatSession, QaItem} from "../interfaces/session";
import {newChat} from "../util/chat";
import {IPresetPrompt} from "../interfaces/prompt";
import {getAddAcc, getUserSlug} from "../util/util";
import Cookies from "js-cookie";
import {RootState} from "./store";

export interface IPushQaItem extends QaItem {
    chatId: string
}

export interface IAppSlice {
    currentChat: string
    currentChatIdx: number
    qaList: QaItem[]
    showProductAlert: boolean
    think: boolean
    loading: boolean
    chats: ChatSession[]
    chatCnt: number
    presetPrompt?: IPresetPrompt
    enabledCtx?: boolean
    enabledStream?: boolean
}

const initChats = JSON.parse(localStorage.getItem('chats') || '[]') as ChatSession[]
let initShowProductAlert = !getUserSlug() && !getAddAcc()

const appSlice = createSlice<IAppSlice, SliceCaseReducers<IAppSlice>>({
    name: "app",
    initialState: {
        currentChat: '' as string,
        qaList: [] as QaItem[],
        showProductAlert: initShowProductAlert,
        think: false,
        loading: false,
        chats: initChats,
        chatCnt: initChats.length,
        presetPrompt: undefined,
        currentChatIdx: -1,
        enabledCtx: true, // 重新打开窗口，默认开户上下文
        enabledStream: false, // 重新打开窗口，默认关闭Stream
    },
    reducers: {
        delChat: (state, action: PayloadAction<{ chatId: string }>) => {
            const {chatId} = action.payload

            for (const chat of state.chats) {
                if (chat.id === chatId) {
                    state.chats.splice(state.chats.indexOf(chat), 1)
                    break
                }
            }
            state.currentChat = ''
        },
        setChatName: (state, action) => {
            const {chatId, name} = action.payload
            const curChat = getChat(state)(chatId)
            if (typeof curChat === 'undefined') {
                throw new Error('currentChat not found')
            }
            curChat.name = name
        },
        setPresetPrompt: (state, action) => {
            const {chatId, presetPrompt} = action.payload
            const curChat = getChat(state)(chatId)
            if (typeof curChat === 'undefined') {
                throw new Error('currentChat not found')
            }
            if (presetPrompt?.act == '无预设') {
                curChat.presetPrompt = undefined
            } else {
                curChat.presetPrompt = presetPrompt
            }
        },
        setAppPresetPrompt: (state, action) => {
            const {chatId, presetPrompt} = action.payload
            state.presetPrompt = presetPrompt
        },
        triggerCtx: (state, action: PayloadAction<{ idx: number, enabledCtx: boolean }>) => {
            const {idx, enabledCtx} = action.payload
            if (idx == -1) {
                state.enabledCtx = enabledCtx;
            } else {
                state.chats[idx].enabledCtx = enabledCtx;
            }
        },
        triggerStream: (state, action: PayloadAction<{ idx: number, enabledStream: boolean }>) => {
            const {idx, enabledStream} = action.payload
            if (idx == -1) {
                state.enabledStream = enabledStream;
            } else {
                state.chats[idx].enabledStream = enabledStream;
            }
        },
        setCurrentChat: (state, action: PayloadAction<{ id: string; idx: number }>) => {
            state.currentChat = action.payload.id;
            state.currentChatIdx = action.payload.idx;
            if (state.currentChatIdx == -1) {
                state.enabledCtx = true
                state.presetPrompt = undefined
                state.enabledStream = false
            }
        },
        setShowProductAlert: (state, action) => {
            state.showProductAlert = action.payload;
        },
        createChat: (state, action) => {
            let curChat: ChatSession | undefined = action.payload
            state.chatCnt += 1
            if (!curChat) {
                curChat = newChat(state.chatCnt)
            }
            state.chats.unshift(curChat)
            state.currentChat = curChat.id
        },
        pushQaItem: (state, action: PayloadAction<IPushQaItem>) => {
            const qaItem = action.payload
            const chatId = qaItem.chatId

            state.qaList.push(action.payload);
            let curChat: ChatSession | undefined = undefined
            curChat = getChat(state)(chatId)
            if (typeof curChat === 'undefined') {
                throw new Error('currentChat not found')
            }
            curChat.qaList.push(action.payload)
            // state.currentChat = curChat.id
        },
        upsertQaItem: (state, action: PayloadAction<IPushQaItem>) => {
            const qaItem = action.payload
            const chatId = qaItem.chatId

            const curChat = getChat(state)(chatId)
            if (!curChat) {
                return
            }
            let found
            curChat.qaList.forEach((item, idx) => {
                if (qaItem.id && qaItem.id == item.id) {
                    curChat.qaList[idx].text += qaItem.text
                    found = true
                }
            })
            if (!found) {
                curChat.qaList.push(qaItem)
            }
            // state.currentChat = curChat.id
        },
        setThink: (state, action) => {
            state.think = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
})

export const {
    setCurrentChat,
    pushQaItem,
    setShowProductAlert,
    setThink,
    setLoading,
    createChat,
    setPresetPrompt,
    setAppPresetPrompt,
    setChatName,
    delChat,
    triggerCtx,
    upsertQaItem,
    triggerStream,
} = appSlice.actions

export function getChat(state: IAppSlice) {
    return function (id: string) {
        for (const chat of state.chats) {
            if (chat.id === id) {
                return chat
            }
        }
        return undefined
    }
}

export function selectEnabledStream(state: RootState) {
    return state.app.currentChatIdx >= 0 ? state.app.chats[state.app.currentChatIdx]?.enabledStream : state.app.enabledStream
}

export default appSlice.reducer