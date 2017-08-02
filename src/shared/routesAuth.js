/**
 * Created by lerayne on 09.05.17.
 */

import url from 'url'

/**
 * Creates new URL string from given pathname and optional "return to" location
 * @param pathname
 * @param prevLocation
 * @returns String
 */
function getRedirectUrl(pathname, prevLocation = false) {
    const urlObject = {
        pathname: pathname,
        query: {}
    }

    if (prevLocation) {
        urlObject.query.next = prevLocation.pathname + prevLocation.search
    }

    return url.format(urlObject)
}

/**
 * Check access to route container and redirect if not allowed
 * @param globalState
 * @param routerState
 * @param redirect
 * @returns Boolean
 */
function redirectionsCheck(globalState, routerState, redirectFunc) {

    const {user} = globalState
    const {routes, location} = routerState
    let redirected = false

    routes.forEach(route => {
        const component = route.component.WrappedComponent || route.component

        if (component.loginRequired && user.id === -1) {
            console.log('redirected to /login')
            redirected = true
            redirectFunc(getRedirectUrl('/login', location))
        }

        if (component.anonymousRequired && user.id !== -1) {
            redirected = true
            // todo - подумать о том что случится, если будет переход на страницу "login"
            // не при помощи набора в адрессной строке (тогда будет простой редирект), а
            // при помощи инструментов router'а - видимо нужно перенаправить юзера откуда
            // пришел
            console.log('redirected to /')
            redirectFunc(getRedirectUrl('/'))
        }
    })

    return redirected
}

/**
 * Handle initial server authorization redirects
 * @param store
 * @returns {Function}
 */
export function authOnEnter(store, nextRouterState, redirect) {
    if (!process.env.BROWSER) {
        redirectionsCheck(store.getState(), nextRouterState, redirect)
    }
}

/**
 * Handle client authorization redirects
 * @param store
 * @returns {Function}
 */
export function authOnChange(store, prevRouterState, nextRouterState, redirect) {
    if (process.env.BROWSER) {
        // onChange is also called under URL query change, we want to omit this, only check on
        // pathname change
        if (prevRouterState.location.pathname !== nextRouterState.location.pathname) {
            redirectionsCheck(store.getState(), nextRouterState, redirect)
        }
    }
}
