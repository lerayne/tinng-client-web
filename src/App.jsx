/**
 * Created by lerayne on 31.03.16.
 */

import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import reducers from './reducers';

import IndexPage from './containers/IndexPage';

const store = createStore(
    combineReducers({
        ...reducers,
        routing: routerReducer
    })
);

const history = syncHistoryWithStore(hashHistory, store);

export default function App () {
    return <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={IndexPage}>

            </Route>
        </Router>
    </Provider>
}