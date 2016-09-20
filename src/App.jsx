/**
 * This is main App component responsible for routing, redux store, actions and reducers, etc
 *
 * Created by lerayne on 31.03.16.
 */

//Simple imports
import './global.css';

//3rd party imports
import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';

//System options
import options from '../options';

//Middlewares
import connectionMiddleware from './middleware/connectionMiddleware';

//Other locals
import combinedReducers from './Reducers';
import Routes from './Routes';

//Actions
import { startConnection } from './actions/global';

// Creating store
const store = createStore(

    combinedReducers,
    
    applyMiddleware(
        routerMiddleware(hashHistory),
        connectionMiddleware(options),
        thunkMiddleware,
    )
);

// Creating history
const history = syncHistoryWithStore(hashHistory, store);

// Starting connection
store.dispatch(startConnection());

// Run redux
export default class App extends Component {
    render (){
        return <Provider store={store}>
            <Router history={history}>
                {Routes}
            </Router>
        </Provider>
    }
}