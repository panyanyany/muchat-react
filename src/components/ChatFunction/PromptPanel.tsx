import React, {Fragment} from "react";
import {Dialog, Transition} from '@headlessui/react'
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline'
import i18nUtil from "../../util/i18n-util";
import {PromptGallery} from "../PromptGallery/PromptGallery";
import {NewPrompt} from "../NewPrompt/NewPrompt";
import {IPresetPrompt} from "../../interfaces/prompt";
import {promptsZh} from "../../util/prompts-zh";

interface IChatFunctionProps {
    show: boolean
    onClose?: () => void
    onChange?: (pp: IPresetPrompt) => void
    pp?: IPresetPrompt
}

export function PromptPanel(props: IChatFunctionProps) {
    const [add, setAdd] = React.useState(false)
    const localPps = JSON.parse(localStorage.getItem('user_prompts') || '[]')
    const pPrompts: IPresetPrompt[] = [{act: '无预设', prompt: '请选择一个预设'}, ...localPps, ...promptsZh]
    const [pps, setPps] = React.useState<IPresetPrompt[]>(pPrompts)
    const [pp, setPp] = React.useState<IPresetPrompt>(props.pp || pPrompts[0])

    return <>
        <Transition.Root show={props.show && !add} as={Fragment}>
            <Dialog as="div" className="relative z-10"
                // initialFocus={this.cancelButtonRef}
                    onClose={() => props.onClose?.()}
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
                        className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 max-h-[100vh]">
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
                                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg max-h-[100vh]">
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
                                                {i18nUtil.t('选择一个预设 Prompt')}<br className="block md:hidden"/>
                                            </Dialog.Title>
                                        </div>
                                    </div>
                                </div>
                                <PromptGallery pPrompts={pps} onSelect={_pp => setPp(_pp)}
                                               defaultPp={props.pp}></PromptGallery>
                                <div
                                    className="bg-gray-50 px-4 py-3 flex sm:flex sm:px-6 gap-1 sm:gap-0 justify-end">

                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            // props.onClose?.()
                                            setAdd(true)
                                        }}
                                    >
                                        {i18nUtil.t('新增')}
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => props.onClose?.()}
                                    >
                                        {i18nUtil.t('取消')}
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => {
                                            props.onChange?.(pp)
                                            props.onClose?.()
                                        }}
                                    >
                                        {i18nUtil.t('确定')}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
        <NewPrompt show={add} onClose={() => {
            setAdd(false)
        }} onChange={(pp) => {
            setAdd(false)
            setPps([pPrompts[0], pp, ...pPrompts.slice(1)])
        }}></NewPrompt>
    </>
}