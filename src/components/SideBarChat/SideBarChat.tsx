import React from "react";
import {ChatSession} from "../../interfaces/session";
import {PromptPanel} from "../ChatFunction/PromptPanel";
import {setAppPresetPrompt, setPresetPrompt} from "../../store/appSlice";
import {useDispatch, useSelector} from "react-redux";
import {SideBarViewChat} from "./SideBarViewChat";
import {SideBarEditChat} from "./SideBarEditChat";

interface Props {
    chat: ChatSession
    selected?: boolean
    onSelect?: (model?: ChatSession) => void
}

export function SideBarChat(props: Props) {
    const dispatch = useDispatch()
    const app = useSelector((state: any) => state.app)
    const [edit, setEdit] = React.useState(false)

    let style: any = {}
    if (props.chat) {
        style.border = 'none'
    }
    if (props.selected) {
        style.backgroundColor = 'rgba(255,255,255,0.1)'
    }
    return (
        <div
            className="flex py-2 px-3 items-center gap-3 rounded-md transition-colors duration-200 text-white text-sm border border-white/20 flex-shrink-0 hover:bg-gray-200/10"
            style={style}
            onClick={() => props.onSelect?.(props.chat)}
        >
            {edit &&
                <SideBarEditChat chat={props.chat} onConfirm={() => setEdit(false)} onCancel={() => setEdit(false)}/>}
            {!edit && <SideBarViewChat chat={props.chat} onEdit={() => setEdit(true)}/>}
        </div>
    )
}