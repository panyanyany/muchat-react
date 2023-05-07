import React from "react";
import {useDispatch, useSelector} from "react-redux";
import store, {RootState} from "../../store/store";
import {getChat, setAppPresetPrompt, setPresetPrompt} from "../../store/appSlice";
import {PromptPanel} from "../ChatFunction/PromptPanel";


export function StatusBar() {
    const app = useSelector((state: RootState) => state.app)
    const currentChat = useSelector((state: RootState) => state.app.currentChat)
    const chat = getChat(store.getState().app)(currentChat)
    const [prompt, setPrompt] = React.useState(false)
    const dispatch = useDispatch()

    return <div className='-mt-3 text-xs text-gray-400 flex justify-center'>
        <div className='bg-green-200 rounded p-1 cursor-pointer'
             onClick={() => setPrompt(true)}>{chat?.presetPrompt?.act || app.presetPrompt?.act || '无预设'}</div>

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
    </div>
}