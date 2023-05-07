import React from "react";
import {ChatSession} from "../../interfaces/session";
import {PromptPanel} from "../ChatFunction/PromptPanel";
import {setAppPresetPrompt, setPresetPrompt} from "../../store/appSlice";
import {useDispatch, useSelector} from "react-redux";
import {ChatFnMenu} from "../ChatFunction/ChatFnMenu";

interface Props {
    chat?: ChatSession
    selected?: boolean
    onSelect?: (model?: ChatSession) => void
}

export function SideBarNewChat(props: Props) {
    const dispatch = useDispatch()
    const app = useSelector((state: any) => state.app)
    const [show, setShow] = React.useState(false)

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
            <a className="cursor-pointer flex flex-1 p-1 items-center">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"
                     strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"
                     height="1em"
                     width="1em"
                     xmlns="http://www.w3.org/2000/svg">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Chat
            </a>

            <a className="cursor-pointer hover:bg-gray-200/10" onClick={() => setShow(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth={2} stroke="currentColor"
                     className="w-5 h-5 justify-end">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
            </a>

            <ChatFnMenu show={show} onClose={() => setShow(false)} chat={props.chat}/>
        </div>
    )
}