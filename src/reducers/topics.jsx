/**
 * Created by lerayne on 16.04.16.
 */

import { FETCH_ALL_REQUEST } from '../actions/global';

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
        
        default: 
            return state;
    }
}