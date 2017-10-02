/**
 * Created by lerayne on 09.05.17.
 */

import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import promiseMiddleware from './promiseMiddleware'

export default function configureStore(initialState = {}) {

    // apply middlewares
    let enhancer
    const middlewares = applyMiddleware(thunk, promiseMiddleware)

    // apply devtools
    if (process.env.NODE_ENV === 'development'){

        const DevTools = require('../client/components/DevTools/index').default

        enhancer = compose(
            middlewares,
            DevTools.instrument()
        )
    } else {
        enhancer = middlewares
    }

    // creates store from root reducer, initial state and middlewares
    const store = createStore(rootReducer, initialState, enhancer)

    // I don't remember what is it for, probably for dynamic modules
    /*if (module.hot) {
        module.hot.accept('./reducers', () =>
            //store.replaceReducer(require('./reducers/index').default)
            store.replaceReducer(require('./rootReducer').default)
        )
    }*/

    return store
}