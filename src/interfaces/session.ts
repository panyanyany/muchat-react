import {IResponseData} from "./api";
import {IPresetPrompt} from "./prompt";

export interface ChatSession {
    id: string
    createdAt: number
    name: string
    presetPrompt?: IPresetPrompt
    qaList: QaItem[]
    enabledCtx?: boolean
    enabledStream?: boolean
}

export interface QaItem {
    id?: string
    dtype: number
    text: string
    hasError: number
    respData?: IResponseData
}

export interface MessageItem {
    role: string
    content: string
}