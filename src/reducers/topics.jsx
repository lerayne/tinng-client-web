/**
 * Created by lerayne on 16.04.16.
 */

import { FETCH_ALL_REQUEST, FETCH_ALL_RESPONSE } from '../actions/global';

const defaultTopicsState = {
    isFetching: false,
    list:[]
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
        
        default: 
            return state;
    }
}