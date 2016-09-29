/**
 * This is main App's component responsible for routing, redux store, actions and reducers, etc
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

//Middlewares
import connectionMiddleware from './middleware/connectionMiddleware';

//Other locals
import combinedReducers from './Reducers';
import Routes from './Routes';

//Actions
import { startConnection } from './actions/global';

const routerMiddlewareCreated = routerMiddleware(hashHistory);

// Run redux
export default class App extends Component {

    constructor(props){
        super(props);

        // Creating store
        this.store = createStore(

            combinedReducers,

            applyMiddleware(
                routerMiddlewareCreated,
                connectionMiddleware({serverURL: props.config.serverURL}),
                thunkMiddleware,
            )
        );

        // Creating history
        this.history = syncHistoryWithStore(hashHistory, this.store);

        // Starting connection
        this.store.dispatch(startConnection());
    }

    render (){

        console.log('config', this.props.config);

        return <Provider store={this.store}>
            <Router history={this.history}>
                {Routes}
            </Router>
        </Provider>
    }
}