/**
 * This is main App's component responsible for routing, redux store, actions and reducers, etc
 *
 * Created by lerayne on 31.03.16.
 */

// config
import {serverURL} from 'global-config';

// 3rd party imports
import React, {Component} from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import {Router, hashHistory} from 'react-router';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';

/**
 * Here starts app's own code
 */

//Developer tools
import DevTools from './devtools/reduxDevTools';

// Middlewares
import connectionMiddleware from './middleware/connectionMiddleware';

// Other locals
import combinedReducers from './Reducers';
import Routes from './Routes';

// Actions
import {startConnection} from './actions/global';

const DEV = process.env.NODE_ENV === 'development';

// composing middleware
let middleware = applyMiddleware(
    routerMiddleware(hashHistory),
    connectionMiddleware({serverURL}),
    thunkMiddleware,
);

if (DEV) {
    middleware = compose(
        middleware,
        DevTools.instrument()
    )
}

// Creating store
const store = createStore(
    combinedReducers,
    middleware
);

// Creating history
const history = syncHistoryWithStore(hashHistory, store);

// Starting connection
store.dispatch(startConnection());

// Main app component
export default class App extends Component {
    render() {

        return (
            <Provider store={store}>
                <div style={{height:'100%'}}>
                    <Router history={history}>
                        {Routes}
                    </Router>

                    {DEV && <DevTools />}
                </div>
            </Provider>
        )
    }
}