import React from "react";
import {useDispatch, useSelector} from "react-redux";
import store, {RootState} from "../../store/store";
import {getChat, setAppPresetPrompt, setPresetPrompt, triggerCtx} from "../../store/appSlice";
import {PromptPanel} from "../ChatFunction/PromptPanel";


export function StatusBar() {
    const app = useSelector((state: RootState) => state.app)
    const currentChat = useSelector((state: RootState) => state.app.currentChat)
    const currentChatIdx = useSelector((state: RootState) => state.app.currentChatIdx)
    const chat = getChat(store.getState().app)(currentChat)
    const [prompt, setPrompt] = React.useState(false)
    // const [ctx, setCtx] = React.useState(true)
    const dispatch = useDispatch()
    const enabledCtx = currentChatIdx >= 0 ? app.chats[app.currentChatIdx].enabledCtx : app.enabledCtx
    const presetPrompt = app.chats[app.currentChatIdx]?.presetPrompt || app.presetPrompt

    return <>
        <div className='-mt-3 text-xs text-gray-400 flex justify-center gap-1'>
            <div className={'rounded p-1 cursor-pointer ' + (presetPrompt?.act ? 'bg-green-200' : '')}
                 onClick={() => setPrompt(true)}>{presetPrompt?.act || '无预设'}</div>
            <div className={'rounded p-1 cursor-pointer ' + (enabledCtx ? 'bg-green-200' : '')}
                 onClick={() => dispatch(triggerCtx({idx: currentChatIdx, enabledCtx: !enabledCtx}))}>
                {enabledCtx ? '启用' : '禁用'}上下文
            </div>

        </div>
        <PromptPanel show={prompt} onClose={() => setPrompt(false)}
                     pp={chat?.presetPrompt || app.presetPrompt}
                     onChange={(pp) => {
                         if (chat?.id) {
                             dispatch(setPresetPrompt({
                                 chatId: chat?.id,
                                 presetPrompt: pp,
                             }))
                         } else {
                             dispatch(setAppPresetPrompt({presetPrompt: pp}))
                         }
                     }}
        />
    </>
}