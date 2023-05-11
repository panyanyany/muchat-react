import {createSlice, PayloadAction, SliceCaseReducers} from "@reduxjs/toolkit";
import {ChatSession, QaItem} from "../interfaces/session";
import {newChat} from "../util/chat";
import {IPresetPrompt} from "../interfaces/prompt";

export interface IPushQaItem extends QaItem {
    chatId: string
}

export interface IAppSlice {
    currentChat: string
    currentChatIdx: number
    qaList: QaItem[]
    showProductAlert: boolean
    think: boolean
    chats: ChatSession[]
    chatCnt: number
    presetPrompt?: IPresetPrompt
    enabledCtx?: boolean
}

const initChats = JSON.parse(localStorage.getItem('chats') || '[]') as ChatSession[]
let initPresetPrompt: any = localStorage.getItem('presetPrompt') || '{}'
try {
    initPresetPrompt = JSON.parse(initPresetPrompt)
} catch (e) {
    initPresetPrompt = null
}
if (!initPresetPrompt?.act) {
    initPresetPrompt = null
}
const initEnabledCtx = JSON.parse(localStorage.getItem('enabledCtx') || 'false')

const appSlice = createSlice<IAppSlice, SliceCaseReducers<IAppSlice>>({
    name: "app",
    initialState: {
        currentChat: '' as string,
        qaList: [] as QaItem[],
        showProductAlert: true,
        think: false,
        chats: initChats,
        chatCnt: initChats.length,
        presetPrompt: initPresetPrompt,
        currentChatIdx: -1,
        enabledCtx: initEnabledCtx,
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
            curChat.presetPrompt = presetPrompt
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
        setCurrentChat: (state, action: PayloadAction<{ id: string; idx: number }>) => {
            state.currentChat = action.payload.id;
            state.currentChatIdx = action.payload.idx;
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
        setThink: (state, action) => {
            state.think = action.payload;
        },
    }
})

export const {
    setCurrentChat,
    pushQaItem,
    setShowProductAlert,
    setThink,
    createChat,
    setPresetPrompt,
    setAppPresetPrompt,
    setChatName,
    delChat,
    triggerCtx,
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

export default appSlice.reducer