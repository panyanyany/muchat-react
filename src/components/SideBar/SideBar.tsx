import React from "react";
import {SideBarChat} from "../SideBarChat/SideBarChat";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {setCurrentChat} from "../../store/appSlice";
import './SideBar.scss'
import {SideBarNewChat} from "../SideBarChat/SideBarNewChat";

interface ISideBarProps {
    show?: boolean
    onHide?: () => void
}

export function SideBar(props: ISideBarProps) {
    const chats = useSelector((state: RootState) => state.app.chats)
    const app = useSelector((state: RootState) => state.app)
    const dispatch = useDispatch()

    const className = props.show ? 'mobile-menu-active' : ''

    return (
        <div className={"hidden md:block md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col " + className}
        >
            <div className="flex min-h-0 h-full flex-col ">
                <div className="flex h-full w-full items-start border-white/20">
                    <nav className="flex flex-col flex-1 space-y-1 p-2 pb-2 w-full bg-gray-900 h-full">
                        <SideBarNewChat onSelect={() => dispatch(setCurrentChat(''))}/>
                        {
                            chats.map((chat) => {
                                return <SideBarChat key={chat.id}
                                                    chat={chat}
                                                    selected={chat.id == app.currentChat}
                                                    onSelect={() => {
                                                        dispatch(setCurrentChat(chat.id))
                                                    }
                                                    }/>
                            })
                        }
                        <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                            <div className="flex flex-col gap-2 text-gray-100 text-sm"></div>
                        </div>
                    </nav>
                    <nav className="flex flex-col space-y-1 p-2 pb-2 h-full md:hidden w-1/6" onClick={() => props?.onHide?.()}>
                    </nav>
                </div>
            </div>
        </div>
    )
}