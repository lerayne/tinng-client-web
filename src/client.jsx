/**
 * Created by lerayne on 09.05.17.
 */

import 'babel-polyfill'
import React      from 'react'
import ReactDOM   from 'react-dom'
import {Provider} from 'react-redux'
import {browserHistory, Router} from 'react-router'

import routes from './shared/routes'
import configureStore from './shared/configureStore'

const initialState = window.REDUX_INITIAL_STATE || {}

const store = configureStore(initialState)

if (process.env.NODE_ENV === 'development') {
    const DevTools = require('./client/components/DevTools').default
    ReactDOM.render(<DevTools store={store}/>, document.getElementById('dev-tools'))

    //importing a file in dev mode - just to copy it to webpack-dev-server static files
    require('file-loader?name=[name].js!../client-config.js')
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            {routes(store)}
        </Router>
    </Provider>,

    document.getElementById('react-view')
)