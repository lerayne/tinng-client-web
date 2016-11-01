/**
 * Created by lerayne on 16.04.16.
 */

import { FETCH_ALL_REQUEST, FETCH_ALL_RESPONSE } from '../actions/global';
import { TOPICS_RECEIVE } from '../actions/topics'

export const defaultTopicsState = {
    isFetching: false,
    list:[],
    sortField:'created',
    sortOrder:'desc'
};

export default function topicsReducer (state = {...defaultTopicsState}, action) {
    switch (action.type) {
        
        case FETCH_ALL_REQUEST:
            return {
                ...state,
                isFetching: true
            };

        case FETCH_ALL_RESPONSE:
            return {
                ...state,
                isFetching: false
            };

        case TOPICS_RECEIVE:
            return {
                ...state,
                isFetching: false,
                list: action.payload.list
            }

        default: 
            return state;
    }
}