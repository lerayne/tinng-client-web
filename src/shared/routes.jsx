/**
 * Created by lerayne on 07.01.17.
 */

import React from 'react'
import {IndexRoute, Route}  from 'react-router'
//local
import {authOnEnter, authOnChange} from './routesAuth'
import Root from './containers/Root'
import TestApp from './containers/TestApp'
import LoginPage from './containers/LoginPage'

/**
 * everything that should be done when entering page
 * (probably not just auth redirect, for future)
 *
 * @param store
 * @returns {Function} - actual onEnter function
 */
function onEnter(store){
    return function (nextRouterState, redirect){
        authOnEnter(store, nextRouterState, redirect)
    }
}

/**
 * everything that should be done when changing URL
 * (probably not just auth redirect, for future)
 *
 * @param store
 * @returns {Function} - actual onChange function
 */
function onChange(store){
    return function(prevRouterState, nextRouterState, redirect){
        authOnChange(store, prevRouterState, nextRouterState, redirect)
    }
}

export default function getRoutingScheme(store) {
    return <Route path='/' component={Root} onEnter={onEnter(store)} onChange={onChange(store)}>
        <IndexRoute component={TestApp}/>
        <Route path="login" component={LoginPage}/>
    </Route>
}