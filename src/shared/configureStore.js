/**
 * Created by lerayne on 09.05.17.
 */

import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import promiseMiddleware from './promiseMiddleware'

export default function configureStore(initialState = {}) {

    let enhancer
    const middlewares = applyMiddleware(thunk, promiseMiddleware)

    if (process.env.NODE_ENV === 'development'){

        const DevTools = require('../client/components/DevTools/index').default

        enhancer = compose(
            middlewares,
            DevTools.instrument()
        )
    } else {
        enhancer = middlewares
    }

    const store = createStore(rootReducer, initialState, enhancer);

    if (module.hot) {
        module.hot.accept('./reducers', () =>
            store.replaceReducer(require('./reducers/index').default)
        );
    }

    return store;
}