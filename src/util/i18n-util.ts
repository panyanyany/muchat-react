import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

const resources = {
    en: {
        translation: {
            "Welcome to React": "Welcome to React and react-i18next",
            "在此输入问题，Shift + Enter 换行，Enter 发送": "Enter your question here, press Shift + Enter for a new line, and press Enter to send",
            '严禁提问敏感信息': '',
            '近期访问量过大，建议多试几次，出错不会计入次数，但不要发一模一样的问题，可以加个标点符号或其他词，或者换个问题。': '',
            '机器人正在思考': 'The robot is thinking',
            '系统临时维护中': 'The system is temporarily under maintenance',
            'GPT接口异常': 'GPT interface exception',
            '未知错误': 'Unknown error',
            '输入激活码': 'Enter activation code',
            '购买入口1': 'Purchase entrance 1',
            '购买入口2': 'Purchase entrance 2',
            '激活码无效或已过期': 'The activation code is invalid or has expired',
            '激活': 'Activate',
            '先体验一下': 'Start a free trial',
            '购买': 'Purchase',
            '额度用完': 'Insufficient quota',
            '额度已过期': 'Expired quota',
            '确定': 'Confirm',
            '取消': 'Cancel',
            '选择一个预设 Prompt': 'Select a preset prompt',
            '无权限': 'No permission',
            '新增': 'Add',
            '新增预设 Prompt': 'Add a preset prompt',
            '菜单': 'Menu',
        }
    },
    zh: {
        translation: {
            "Welcome to React": "Welcome to React and react-i18next",
            "在此输入问题，Shift + Enter 换行，Enter 发送": "在此输入问题，Shift + Enter 换行，Enter 发送",
            '严禁提问敏感信息': '严禁提问敏感信息',
            '近期访问量过大，建议多试几次，出错不会计入次数，但不要发一模一样的问题，可以加个标点符号或其他词，或者换个问题。': '近期访问量过大，建议多试几次，出错不会计入次数，但不要发一模一样的问题，可以加个标点符号或其他词，或者换个问题。',
            '机器人正在思考': '机器人正在思考',
            '系统临时维护中': '系统临时维护中',
            'GPT接口异常': 'GPT接口异常',
            '未知错误': '未知错误',
            '输入激活码': '输入激活码',
            '购买入口1': '购买入口1',
            '购买入口2': '购买入口2',
            '激活码无效或已过期': '激活码无效或已过期',
            '激活': '激活',
            '先体验一下': '先体验一下',
            '购买': '购买',
            '额度用完': '额度用完',
            '额度已过期': '额度已过期',
            '确定': '确定',
            '取消': '取消',
            '选择一个预设 Prompt': '选择一个预设 Prompt',
            '无权限': '无权限',
            '新增': '新增',
            '新增预设 Prompt': '新增预设 Prompt',
            '菜单': '菜单',
        }
    }
};

i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
    // .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,
        detection: {
            order: [
                'querystring',
                'cookie',
                // 'localStorage',
                // 'sessionStorage',
                'navigator',
                // 'htmlTag',
                // 'path',
                // 'subdomain',
            ],
            caches: [
                // 'localStorage',
                // 'cookie',
            ],
        },

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    });


export default i18n;