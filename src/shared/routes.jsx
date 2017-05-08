/**
 * Created by lerayne on 07.01.17.
 */

import React from 'react'
import {IndexRoute, Route}  from 'react-router'
import {authOnEnter, authOnChange} from './routesAuth'

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
    return <Route path='/' component={App} onEnter={onEnter(store)} onChange={onChange(store)}>
        <IndexRoute component={}/>
        <Route path="login" component={LoginPage}/>
    </Route>
}