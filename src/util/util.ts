import Cookies from "js-cookie";
import {agents} from "../config/agents";


export function getUrlSlug() {
    return location.pathname.split('?')[0].split('/')[1]
}

export function getUserSlug() {
    let slug;
    slug = getUrlSlug()
    if (slug) {
        return slug
    }
    slug = Cookies.get('slug')
    return slug
}

export function urlSlugToCookie(urlSlug?: string) {
    if (!urlSlug) {
        urlSlug = getUrlSlug()
    }
    Cookies.set('slug', urlSlug)
    history.pushState({}, '', '/')
}

export function urlArgsToCookie() {
    const slug = getUrlSlug()
    if (slug) {
        Cookies.set('slug', slug)
    }

    const queryArgs = {
        'typed': {display: false},
        'demo': {display: false},
        'lng': {display: false},
        'i18next': {display: false},
    }

    // 拿 query 参数
    const u = new URLSearchParams(location.search)
    let hasChanged = false
    for (const argName of Object.keys(queryArgs)) {
        const argValue = u.get(argName)
        if (!argValue) {
            continue
        }
        Cookies.set(argName, argValue)
        if (!queryArgs[argName].display) {
            hasChanged = true
            u.delete(argName)
        }
    }

    if (hasChanged) {
        // 重新写入 url
        let search = ''
        if (u.toString()) {
            search = '?' + u.toString()
        }
        history.pushState({}, '', '/' + search)
    }
}

export function slugToUrl() {
    let slug;
    slug = getUrlSlug()
    if (!slug) {
        slug = Cookies.get('slug')
        const demo = Cookies.get('demo')
        if (slug && !demo) {
            history.pushState({}, '', '/' + slug)
        }
    }
}

export function getAgent() {
    const subSite = location.host.split('.')[0]
    return agents[subSite] || agents[location.hostname] || {}
}


export function getAddAcc() {
    const u = new URLSearchParams(location.search)
    return !!u.get('add-acc')
}