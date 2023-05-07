import React from "react";
import './PromptGallery.scss'
import {IPresetPrompt} from "../../interfaces/prompt";


interface IPromptGalleryProps {
    pPrompts: IPresetPrompt[]
    onSelect?: (pp: IPresetPrompt) => void
    defaultPp?: IPresetPrompt
}

export function PromptGallery(props: IPromptGalleryProps) {
    const pPrompts = props.pPrompts
    let initSelected = 0, initOption = {} as IPresetPrompt
    if (props.defaultPp) {
        initSelected = pPrompts.findIndex((v) => {
            return v.act === props!.defaultPp!.act
        })
        if (initSelected === -1) {
            initSelected = 0
        }
        initOption = pPrompts[initSelected]
    }
    const [hint, setHint] = React.useState(initOption)
    const [selected, setSelected] = React.useState(initSelected)
    const [filter, setFilter] = React.useState('' as string)

    function handleSelect(option: IPresetPrompt, index) {
        setHint(option)
        setSelected(index)
        props?.onSelect?.(option)
    }

    return <div className='mx-5 text-gray-600'>
        <input type="text" className='w-full border-gray-300 mb-2 rounded' placeholder='输入关键词搜索'
               onChange={(e) => setFilter(e.target.value)}/>
        <ul className='flex flex-1 prompt-panel w-full scroll-auto flex-wrap block overflow-y-auto max-h-[10rem] border-b-gray-50' style={{fontSize: '0.8rem'}}>
            {pPrompts.filter((v, i) => {
                return v.act.includes(filter) || v.prompt.includes(filter)
            }).map((option, index) => {
                return <li key={index}
                           className={'flex flex-col items-center justify-center' + (index === selected ? ' selected' : '')}
                           onMouseEnter={() => setHint(option)}
                           onTouchStart={() => handleSelect(option, index)}
                           onClick={() => handleSelect(option, index)}
                >
                    {option.act}
                </li>
            })}
        </ul>
        <hr/>
        <pre className='p-2 h-[8rem] overflow-y-auto whitespace-pre-wrap text-gray-500' style={{fontSize: '0.8rem'}}>{hint.prompt}</pre>
    </div>
}