import React, {Fragment} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline'
import Cookies from 'js-cookie'
import {checkUserSlug} from "../../api/api";
import {getAgent, slugToUrl, urlSlugToCookie} from "../../util/util";
import i18nUtil from "../../util/i18n-util";

export interface ProductAlertProps {
    show?: boolean
    trigger: (show: boolean) => void
}

interface AuthResult {
    auth: boolean
    reach_cap: boolean
    expired: boolean
}

export function ProductAlert(props: ProductAlertProps) {
    const [userSlug, setUserSlug] = React.useState('')
    const [authRes, setAuthRes] = React.useState<AuthResult | null>(null)

    const aff = getAgent()
    const cancelButtonRef: any = React.useRef(null)

    async function startApply() {
        setAuthRes(null)
        let slug = userSlug
        let isUrlSlug = false
        if (slug.startsWith("http")) {
            // location.href = this.state.userSlug
            // return
            slug = slug.split('/').slice(-1)[0]
            isUrlSlug = true
        }
        if (!slug) {
            return
        }
        const data = await checkUserSlug(slug)
        if (data.data.auth && !data.data.reach_cap && !data.data.expired) {
            if (isUrlSlug) {
                urlSlugToCookie(slug)
            } else {
                Cookies.set('slug', slug)
            }
            slugToUrl()
            setAuthRes(data.data)
            setUserSlug('')
            props.trigger(false)
            return
        }
        setAuthRes(data.data)
    }

    let ad1;
    if (aff.adLink1) {
        ad1 = <a href={aff.adLink1} className='text-blue-500'
                 target="_blank"
                 referrerPolicy="no-referrer"> {i18nUtil.t('购买入口1')}</a>
    } else {
        if (aff.wechat) {
            ad1 = `(购买联系V：${aff.wechat})`
        }
    }

    let authMsg;
    if (!authRes) {
        //
    } else if (!authRes.auth) {
        authMsg = <p className="text-sm text-red-500">
            {i18nUtil.t('激活码无效或已过期')}
        </p>
    } else if (authRes.reach_cap) {
        authMsg = <p className="text-sm text-red-500">
            {i18nUtil.t('额度用完')}
        </p>
    } else if (authRes.expired) {
        authMsg = <p className="text-sm text-red-500">
            {i18nUtil.t('额度已过期')}
        </p>
    }
    console.log('authRes', authRes)

    return (
        <Transition.Root show={props.show && !aff.disableAlert} as={Fragment}>
            <Dialog as="div" className="relative z-10"
                // initialFocus={this.cancelButtonRef}
                    onClose={() => 1}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div
                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div
                                            className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600"
                                                                     aria-hidden="true"/>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3"
                                                          className="text-lg font-medium leading-6 text-gray-900">
                                                {i18nUtil.t('输入激活码')}<br className="block md:hidden"/>
                                                {ad1}
                                                {/*&nbsp;*/}
                                                {/*{this.state.adLink2 ? (*/}
                                                {/*    <a href={this.state.adLink2} className='text-blue-500'*/}
                                                {/*       referrerPolicy="no-referrer"> {i18nUtil.t('购买入口2')}</a>) : ''}*/}
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                </p>
                                                <input type="text" className="from-input rounded text-pink-500"
                                                       value={userSlug}
                                                       onChange={e => setUserSlug(e.target.value)}
                                                       onKeyUp={e => {
                                                           if (e.code == 'Enter') startApply()
                                                       }}
                                                />
                                                {authMsg}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="bg-gray-50 px-4 py-3 flex flex-col-reverse sm:flex sm:flex-row-reverse sm:px-6 gap-1 sm:gap-0">
                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => startApply()}
                                    >
                                        {i18nUtil.t('激活')}
                                    </button>
                                    {aff.adLink1 &&
                                        <a
                                            type="button"
                                            className="cursor-pointer inline-flex w-full justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                            href={aff.adLink1}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            // onClick={() => window.open(this.state.adLink1, '_blank', 'noopener,noreferrer')}
                                        >
                                            {i18nUtil.t('购买')}
                                        </a>}
                                    {!aff.preventCancel &&
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={() => {
                                                Cookies.set('trail', '1')
                                                props.trigger(false)
                                            }}
                                            ref={cancelButtonRef}
                                        >
                                            {i18nUtil.t('先体验一下')}
                                        </button>}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
