/**
 * This is main App component responsible for routing, redux store, actions and reducers, etc
 *
 * Created by lerayne on 31.03.16.
 */

import React, { Component } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';

import './global.css';

import reducers from './reducers';

import IndexPage from './containers/IndexPage';

const store = createStore(
    combineReducers({
        ...reducers,
        routing: routerReducer
    }),
    applyMiddleware(
        routerMiddleware(hashHistory),
        thunkMiddleware
    )
);

const history = syncHistoryWithStore(hashHistory, store);

export default class App extends Component {
    render (){
        return <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={IndexPage}>

                </Route>
            </Router>
        </Provider>
    }
}