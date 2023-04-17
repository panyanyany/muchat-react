import React from 'react';
import './AskBox.css'
import {AiOutlineCopy} from "react-icons/ai";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default class AskBox extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {copied: false}
    }

    async handleCopyButton(e) {
        navigator.clipboard.writeText(this.props.text)
    }

    render() {
        let tips;
        if (/\d+\s*字/.test(this.props.text)) {
            tips = (
                <div className={'text-left text-gray-400 text-xs'}>
                    <hr/>
                    官方接口一次最多返回 2000 字左右，太多字容易报错。不要硬性规定字数，等它回答完后，让它 “继续” 即可。
                </div>
            )
        }
        return (
            <div
                className="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800">
                <div className="text-base gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
                    <div className="w-[30px] flex flex-col relative items-end">
                        <div className="relative flex"><span
                            id="span001"><span
                            id="span002"><img
                            alt="" aria-hidden="true"
                            src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2730%27%20height=%2730%27/%3e"
                            id="img001"/></span><img
                            alt="Wynell Digrazia"
                            src="./_next/image/u.jpg"
                            decoding="async" data-nimg="intrinsic" className="rounded-sm"
                            id="img002"
                        /></span>
                        </div>
                    </div>
                    <div className="relative lg:w-[calc(100%-115px)] w-full flex flex-col">
                        <div
                            className="min-h-[20px] whitespace-pre-wrap flex flex-col items-start gap-4 tpl-text">{this.props.text}{tips}</div>
                        <div
                            className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2">
                            <CopyToClipboard text={this.props.text}
                                             onCopy={() => this.setState({copied: true})}
                                             options={{format: 'text/plain'}}
                            >
                                <button
                                    className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2"
                                         viewBox="0 0 24 24" strokeLinecap="round"
                                         strokeLinejoin="round" className="w-4 h-4 hidden" height="1em"
                                         width="1em" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                                    </svg>
                                    <AiOutlineCopy></AiOutlineCopy>
                                </button>
                            </CopyToClipboard>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}