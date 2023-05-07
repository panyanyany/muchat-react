import React from "react";
import {ChatSession} from "../../interfaces/session";
import {PromptPanel} from "../ChatFunction/PromptPanel";
import {setAppPresetPrompt, setChatName, setPresetPrompt} from "../../store/appSlice";
import {useDispatch, useSelector} from "react-redux";

interface Props {
    chat: ChatSession
    onConfirm?: (value: string) => void
    onCancel?: () => void
}

export function SideBarEditChat(props: Props) {
    const dispatch = useDispatch()
    const app = useSelector((state: any) => state.app)
    const [edit, setEdit] = React.useState(false)
    const [value, setValue] = React.useState(props.chat.name)

    let style: any = {}
    return (
        <>
            <a className='cursor-pointer flex flex-1 p-1 items-center'>
                <input type='text' defaultValue={value} className='bg-gray-900 p-0 w-full'
                       autoFocus={true}
                       onChange={(e) => setValue(e.target.value)}
                       style={{fontSize: 'inherit'}}
                       onKeyUp={(e) => {
                           if (e.key === 'Enter') {
                               props.onConfirm?.(value)
                               dispatch(setChatName({chatId: props.chat.id, name: value}))
                           }
                           if (e.key === 'Escape') {
                               props.onCancel?.()
                           }
                       }}
                       onBlur={() => {
                            props.onCancel?.()
                       }}
                />
            </a>

            <a className="cursor-pointer flex p-0 items-center" onClick={() => {
                props.onConfirm?.(value)
                dispatch(setChatName({chatId: props.chat.id, name: value}))
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                     height="1em"
                     width="1em"
                     stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>

            </a>

            <a className="cursor-pointer flex p-0 items-center" onClick={() => props.onCancel?.()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                     height="1em"
                     width="1em"
                     stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </a>

        </>
    )
}