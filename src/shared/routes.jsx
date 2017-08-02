/**
 * Created by lerayne on 07.01.17.
 */

import React from 'react'
import {IndexRoute, Route}  from 'react-router'
import {authOnEnter, authOnChange} from './routesAuth'
//local
import Root from './containers/Root'
import TestApp from './containers/TestApp'
import LoginPage from './containers/LoginPage'

function onEnter(store){
    return function (...args){
        authOnEnter(store, ...args)
    }
}

function onChange(store){
    return function(...args){
        authOnChange(store, ...args)
    }
}

export default function routes(store) {
    return <Route path='/' component={Root} onEnter={onEnter(store)} onChange={onChange(store)}>
        <IndexRoute component={TestApp}/>
        <Route path="login" component={LoginPage}/>
    </Route>
}