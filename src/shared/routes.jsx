/**
 * Created by lerayne on 07.01.17.
 */

import React from 'react'
import url from 'url'
import {IndexRoute, Route}  from 'react-router'

/**
 * Creates new URL string from given pathname and optional "return to" location
 * @param pathname
 * @param prevLocation
 * @returns String
 */
function getRedirectUrl(pathname, prevLocation = false){
    const urlObject = {
        pathname: pathname,
        query: {}
    }

    if (prevLocation){
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
function redirectionsCheck(globalState, routerState, redirectFunc){

    const {user} = globalState
    const {routes, location} = routerState
    let redirected = false

    routes.forEach(route => {
        const component = route.component.WrappedComponent || route.component

        if (component.loginRequired && user.id === -1) {
            redirected = true
            redirectFunc(getRedirectUrl('/login', location))
        }

        if (component.anonymousRequired && user.id !== -1) {
            redirected = true
            // todo - подумать о том что случится, если будет переход на страницу "login"
            // не при помощи набора в адрессной строке (тогда будет простой редирект), а
            // при помощи инструментов router'а - видимо нужно перенаправить юзера откуда
            // пришел
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
function onEnter(store){
    return function (nextRouterState, redirect){
        if (!process.env.BROWSER){
            redirectionsCheck(store.getState(), nextRouterState, redirect)
        }
    }
}

/**
 * Handle client authorization redirects
 * @param store
 * @returns {Function}
 */
function onChange(store){
    return function(prevRouterState, nextRouterState, redirect){
        if (process.env.BROWSER){
            // onChange is also called under URL query change, we want to omit this, only check on
            // pathname change
            if (prevRouterState.location.pathname !== nextRouterState.location.pathname){
                redirectionsCheck(store.getState(), nextRouterState, redirect)
            }
        }
    }
}

export default function RoutesComponent(store) {
    return <Route
        component={App}
        path='/'
        onEnter={onEnter(store)}
        onChange={onChange(store)}
    >
        <IndexRoute component={TransactionsPage}/>
        <Route path="login" component={LoginPage}/>
    </Route>
}