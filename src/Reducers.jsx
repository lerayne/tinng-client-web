/**
 * Created by lerayne on 20.09.16.
 */

import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import topics from './reducers/topics';

export default combineReducers({
    topics,
    routing: routerReducer
})