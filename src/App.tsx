import React from 'react';
import * as _ from 'lodash'
import Cookies from 'js-cookie'
import './App.css';
import AskBox from "./features/AskBox/AskBox";
import {ReplyBox} from "./features/ReplyBox/ReplyBox";
import axios from "axios";
import {ProductAlert} from "./features/ProductAlert/ProductAlert";
import {getAgent, getUrlSlug, slugToUrl, urlArgsToCookie} from "./util/util";
import {IResponseData} from "./models/api";
import i18nUtil from './util/i18n-util'
import {AppConfig} from "./config/app";


const D_ASK = 1
const D_REPLY = 2

interface QaItem {
    dtype: number
    text: string
    hasError: number
    respData?: IResponseData
}

interface State {
    qaList?: QaItem[]
    thinking?: boolean
    question?: string
    textAreaRows?: number
    showAddAccForm?: boolean;
    showProductAlert?: boolean
}

interface MessageItem {
    role: string
    content: string
}

export default class App extends React.Component<any, State> {
    constructor(props) {
        super(props);

        const agent = getAgent()
        if (!agent.i18n) {
            i18nUtil.changeLanguage('zh-CN')
        }

        let showProductAlert = !this.getUserSlug() && !this.getAddAcc()

        urlArgsToCookie()
        slugToUrl()

        if (location.hostname.endsWith('ai9.top')) {
            showProductAlert = false
            Cookies.set('trail', '1')
        }

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

        this.state = {
            qaList: [] as QaItem[],
            thinking: false,
            question: '',
            textAreaRows: 1,
            showAddAccForm: this.getAddAcc(),
            showProductAlert: showProductAlert,
            // showProductAlert: false,
        }
        this.qaContainerTail = React.createRef()
        this.textArea = React.createRef()
        this.productAlert = React.createRef()
    }

    counterTimer?: any

    componentDidMount() {
        // window.document.title = 'AI6 - ' + location.hostname
    }

    qaContainerTail: React.RefObject<any>
    textArea: React.RefObject<any>
    productAlert: React.RefObject<any>

    addDialog(dtype: number, text: string, hasError = 0, respData = undefined) {
        const qaList = this.state.qaList!.slice()
        qaList.push({dtype, text, hasError, respData})
        this.setState({qaList})
        setTimeout(() => {
            this.qaContainerTail.current.scrollIntoView()
        }, 200)
    }

    async handleKeyEventEnter(e: React.KeyboardEvent<any>) {
        if (e.code === 'Enter' && !e.shiftKey) {
            await this.handleClick()
        }
    }

    async handleInput(e: any) {
        const textarea = this.textArea.current
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }

    async handleClick(e: React.MouseEvent<any> | null = null) {
        const question = _.trim(this.state.question)
        if (!question) {
            return
        }

        this.setState({question: '', textAreaRows: 1})
        const textarea = this.textArea.current
        textarea.style.height = ''

        this.addDialog(D_ASK, question)
        this.submitQuestion(question)
    }

    handleChange(e) {
        // Return if user presses the enter key
        if (e.nativeEvent.inputType === "insertLineBreak") return;

        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    getUserSlug() {
        let slug;
        slug = getUrlSlug()
        if (slug) {
            return slug
        }
        slug = Cookies.get('slug')
        return slug
    }

    getAddAcc() {
        const u = new URLSearchParams(location.search)
        return !!u.get('add-acc')
    }

    async submitQuestion(question) {
        this.setState({thinking: true})
        // setTimeout(() => {
        //     this.setState({thinking: true})
        // }, 200)

        const msgAry = this.state.qaList!.filter(e => !e.hasError)
        const messages: MessageItem[] = []
        for (const item of msgAry) {
            const role = item.dtype == D_ASK ? 'user' : 'assistant'
            const content = item.text
            messages.push({role, content})
        }
        messages.push({role: 'user', content: question})

        const lastAry = this.state.qaList!.filter(e => !e.hasError && e.dtype == D_REPLY).slice(-1)
        if (lastAry.length == 1) {
            question = lastAry[0].text + '\n\n' + question
        }
        let resp, msg, hasError, respData
        try {
            resp = await axios.post(AppConfig.API_ENDPOINT + '/query', {
                question: question,
                messages,
                slug: this.getUserSlug()
            }, {timeout: 2 * 60_000})
            respData = resp.data
            if (respData.code === 0) {
                msg = respData.data.answer
            } else {
                msg = respData.data.content
            }
            hasError = resp.data.code != 0
        } catch (e: any) {
            if (e?.response?.data) {
                respData = e.response.data
                console.log('respData in error,', respData)
                msg = JSON.stringify(respData)

                if (respData.code == 2002 || respData.code == 2003 || respData.code == 2005) {
                    this.triggerProductAlert(true)
                }

            } else {
                msg = e.toString()
            }
            hasError = 1
        }
        this.setState({thinking: false})
        this.addDialog(D_REPLY, msg, hasError, respData)
    }

    triggerProductAlert(val) {
        this.setState({showProductAlert: val})
    }

    triggerAddAccForm(val) {
        this.setState({showAddAccForm: val})
    }

    renderMobileMenu() {
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
                        className="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden">
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

    render() {
        const qaListOrigin = this.state.qaList!
        const qaList = qaListOrigin.map((e, i) => {
            if (e.dtype === D_ASK) {
                return (<AskBox text={e.text} key={i}></AskBox>)
            } else {
                return (<ReplyBox text={e.text} key={i} hasError={e.hasError} index={i}
                                  total={qaListOrigin.length} respData={e.respData}></ReplyBox>)
            }
        })
        const showWelcome = qaListOrigin.length == 0

        let thinkingBox;
        if (this.state.thinking) {
            thinkingBox = (
                <ReplyBox text={''}
                          hasError={0}
                          index={qaListOrigin.length}
                          total={qaListOrigin.length}
                          waiting={true}
                ></ReplyBox>)
        }

        let content;
        if (this.getUserSlug() || Cookies.get('trail')) {
            content = (
                <div className="overflow-hidden w-full h-full relative">
                    <div className="flex flex-1 flex-col md:pl-60 h-full">
                        {this.renderMobileMenu()}
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
                                            {qaList}
                                            {thinkingBox}
                                            <div className="w-full h-48 flex-shrink-0" ref={this.qaContainerTail}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient">
                                <form
                                    className="flex flex-row stretch gap-3 mx-2 lg:mx-auto pt-2 lg:pt-6 lg:max-w-3xl last:mb-2 md:last:mb-6"
                                    id="inputForm">
                                    <div className="relative flex-1 h-full flex flex-col">
                                        <div className="w-full flex gap-2 justify-center mb-3"></div>
                                        <div
                                            className="flex flex-col w-full py-2 pl-3 md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                                <textarea tabIndex={0}
                                          data-id="root"
                                          id="inputArea"
                                          style={{maxHeight: '200px', overflowY: 'hidden'}}
                                          rows={this.state.textAreaRows}
                                          placeholder={i18nUtil.t("在此输入问题，Shift + Enter 换行，Enter 发送") || ''}
                                          name='question'
                                          value={this.state.question}
                                          onChange={e => this.handleChange(e)}
                                          onKeyUp={(e) => this.handleKeyEventEnter(e)}
                                          onInput={e => this.handleInput(e)}
                                          ref={this.textArea}
                                          className="w-full resize-none focus:ring-0 focus-visible:ring-0 p-0 pr-7 m-0 border-0 bg-transparent dark:bg-transparent"></textarea>
                                            <button
                                                onClick={(e) => this.handleClick(e)}
                                                type="button"
                                                className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent">
                                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0"
                                                     viewBox="0 0 20 20"
                                                     className="w-4 h-4 rotate-90" height="1em" width="1em"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <div
                                    className="text-xs text-black/50 dark:text-white/50 pt-2 pb-3 px-3 md:pt-3 md:pb-6 md:px-4 text-center">
                                    <a href='https://github.com/panyanyany/muchat-aio'>Powered by Muchat</a>
                                </div>
                            </div>
                        </main>
                    </div>
                    <div className="hidden md:block md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col bg-gray-900">
                        <div className="flex min-h-0 h-full flex-col ">
                            <div className="flex flex-1 h-full w-full items-start border-white/20">
                                <nav className="flex flex-col flex-1 h-full space-y-1 m-2 pb-2"><a
                                    className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm border border-white/20 flex-shrink-0">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24"
                                         strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" height="1em"
                                         width="1em"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    New Thread</a>
                                    <div className="flex-col flex-1 overflow-y-auto border-b border-white/20">
                                        <div className="flex flex-col gap-2 text-gray-100 text-sm"></div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="app">
                <ProductAlert
                    show={this.state.showProductAlert}
                    trigger={val => this.triggerProductAlert(val)}
                ></ProductAlert>
                {content}
            </div>
        );
    }
}

