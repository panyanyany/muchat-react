import React, {useState} from 'react';
import Cookies from 'js-cookie'
import './App.css';
import AskBox from "./features/AskBox/AskBox";
import {ReplyBox} from "./features/ReplyBox/ReplyBox";
import {ProductAlert} from "./features/ProductAlert/ProductAlert";
import {getAddAcc, getAgent, getUserSlug, slugToUrl, urlArgsToCookie} from "./util/util";
import i18nUtil from './util/i18n-util'
import {SideBar} from "./components/SideBar/SideBar";
import {MessageInputForm} from "./components/MessageInputForm/MessageInputForm";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./store/store";
import {setShowProductAlert} from "./store/appSlice";
import {QaItem} from "./interfaces/session";
import {StatusBar} from "./components/StatusBar/StatusBar";


const D_ASK = 1
const D_REPLY = 2


interface State {
    showAddAccForm?: boolean;
    showProductAlert?: boolean
}

export default function App() {
    const showProductAlert = useSelector((state: RootState) => state.app.showProductAlert)
    const dispatch = useDispatch()
    const [showAddAccForm, setShowAddAccForm] = useState(getAddAcc())
    const think = useSelector((state: RootState) => state.app.think)
    const app = useSelector((state: RootState) => state.app)
    const [showMenu, setShowMenu] = useState(false)

    const agent = getAgent()
    if (!agent.i18n) {
        i18nUtil.changeLanguage('zh-CN')
    }

    urlArgsToCookie()
    slugToUrl()

    if (Cookies.get('demo')) {
        // URL动画
        // const URL = URLAnimation();
        // URL.start(Animations.wave)
        // URL.start(new Custom(["5", "4", "3", "2", "1"], 600))
        // specify Animation here

        // setTimeout(() => {
        //     URL.stop(); // Stop Animation
        // }, 5000)
    }

    function triggerProductAlert(val) {
        dispatch(setShowProductAlert(val))
    }

    function triggerAddAccForm(val) {
        setShowAddAccForm(val)
    }

    function renderMobileMenu() {
        let adText;
        const subSite = location.host.split('.')[0]
        const useTyped = Cookies.get('typed') == '1'
        if ((subSite == 'c' || subSite == 'cc' || subSite == 'localhost:3000') && !useTyped) {
            adText = (
                <div>
                    <div></div>
                    {/*<a*/}
                    {/*    className="text-red-500 underline"*/}
                    {/*    target="_blank"*/}
                    {/*    // href="https://mp.weixin.qq.com/s?__biz=Mzk0MjQwNTM3Nw==&mid=2247483754&idx=1&sn=b2f03f12c1e74fa66365dce3955e93eb&chksm=c2c2e304f5b56a12224b246e57f087efda3b90016d82e613633593ab50eeeab78ac8b46db6d8#rd"*/}
                    {/*    // href="https://x3xtqfjuve.feishu.cn/docx/LbFadc4j1oo6vVxzLP1cTfCznId"*/}
                    {/*    href="https://www.kuaifaka.net/purchasing?link=X7FFr31U"*/}
                    {/*>*/}
                    {/*</a>*/}
                    {/*<span className="ml-3 text-xs hidden">ChatGPT账号批发（非本站激活码）: redcover123 </span>*/}
                </div>
                // <a
                //     className="text-red-500 underline"
                //     >
                //     通知：本站将于02月07日上午07:00~10:00进行维护，服务将不可用。
                // </a>
            )
        }

        return (
            <div
                className="flex items-center text-left sticky top-0 z-10 bg-white border-b dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 text-gray-600 pl-1 pt-1 sm:pl-3 sm:pt-3">
                <button type="button"
                        className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
                        onClick={() => setShowMenu(!showMenu)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24"
                         strokeLinecap="round"
                         strokeLinejoin="round" className="w-6 h-6" height="1em" width="1em"
                         xmlns="http://www.w3.org/2000/svg">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                {adText}
            </div>
        )
    }

    let qaListOrigin: QaItem[] = []
    for (const chat of app.chats) {
        if (chat.id == app.currentChat) {
            qaListOrigin = chat.qaList
        }
    }
    const qaListDom = qaListOrigin.map((e, i) => {
        if (e.dtype === D_ASK) {
            return (<AskBox text={e.text} key={i}></AskBox>)
        } else {
            return (<ReplyBox text={e.text} key={i} hasError={e.hasError} index={i}
                              total={qaListOrigin.length} respData={e.respData}></ReplyBox>)
        }
    })
    const showWelcome = qaListOrigin.length == 0

    let thinkingBox;
    if (think) {
        thinkingBox = (
            <ReplyBox text={''}
                      hasError={0}
                      index={qaListOrigin.length}
                      total={qaListOrigin.length}
                      waiting={true}
            ></ReplyBox>)
    }

    let content;
    if (getUserSlug() || Cookies.get('trail')) {
        content = (
            <div className="overflow-hidden w-full h-full relative">
                <div className="flex flex-1 flex-col md:pl-60 h-full">
                    {renderMobileMenu()}
                    <main
                        className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
                        <div className="flex-1 overflow-hidden">
                            <div className="react-scroll-to-bottom--css-ldqxq-79elbk h-full dark:bg-gray-800">
                                <div className="react-scroll-to-bottom--css-ldqxq-1n7m0yu">
                                    <div
                                        className={"flex flex-col items-center text-sm h-full dark:bg-gray-800 " + `${showWelcome ? '' : 'hidden'}`}
                                        id="mainBox0">
                                        <div
                                            className="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
                                            <div
                                                className="text-xl font-semibold mt-[20vh] ml-auto mr-auto mb-16">
                                                <br/>
                                            </div>
                                        </div>
                                        <div
                                            className="text-gray-400">{i18nUtil.t('严禁提问敏感信息')}
                                        </div>
                                        <div className="w-full h-48 flex-shrink-0"></div>
                                    </div>
                                    <div className="flex flex-col items-center text-sm h-full dark:bg-gray-800"
                                         id="mainBox1"
                                         style={{overflowY: 'auto'}}>
                                        {qaListDom}
                                        {thinkingBox}
                                        <div className="w-full h-48 flex-shrink-0" id="qaContainerTail"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient">
                            <MessageInputForm></MessageInputForm>
                            <StatusBar/>
                            <div
                                className="text-xs text-black/50 dark:text-white/50 pt-2 pb-3 px-3 md:pt-3 md:pb-6 md:px-4 text-center">
                                <a href='https://github.com/panyanyany/muchat-aio'>Powered by Muchat</a>
                            </div>
                        </div>
                    </main>
                </div>
                <SideBar show={showMenu} onHide={() => setShowMenu(false)}></SideBar>
            </div>
        )
    }

    return (
        <div className="app">
            <ProductAlert
                show={showProductAlert}
                trigger={val => triggerProductAlert(val)}
            ></ProductAlert>
            {content}
        </div>
    );
}

