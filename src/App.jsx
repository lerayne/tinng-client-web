/**
 * This is main App component responsible for routing, redux store, actions and reducers, etc
 *
 * Created by lerayne on 31.03.16.
 */

import './global.css';

import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';

import options from '../options';

import connectionMiddleware from './middleware/connectionMiddleware';

import combinedReducers from './Reducers';
import Routes from './Routes';

import { startConnection } from './actions/global';

const store = createStore(

    combinedReducers,
    
    applyMiddleware(
        routerMiddleware(hashHistory),
        connectionMiddleware(options),
        thunkMiddleware,
    )
);

const history = syncHistoryWithStore(hashHistory, store);

store.dispatch(startConnection());

export default class App extends Component {
    render (){
        return <Provider store={store}>
            <Router history={history}>
                {Routes}
            </Router>
        </Provider>
    }
}