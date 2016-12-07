/**
 * Created by lerayne on 16.04.16.
 */

import sortBy from 'lodash/sortBy';

import {FETCH_ALL_REQUEST, FETCH_ALL_RESPONSE} from '../actions/global';
import {TOPICS_RECEIVE} from '../actions/topics'

export const defaultTopicsState = {
    isFetching: false,
    list: [],
    sortField: 'updated',
    sortOrder: 'desc'
};

export default function topicsReducer(state = {...defaultTopicsState}, action) {
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
                list: parseTopicsList(state, action.payload.list)
            }

        case 'add_test_topic':
            return {
                ...state,
                list: [
                    ...state.list,
                    {...state.list[0], id: state.list[0].id + 'test'}
                ]
            }

        default:
            return state;
    }
}

function sort(list, sortField, sortOrder) {
    const sorted = sortBy(list, [sortField])

    return sortOrder == 'asc' ? sorted : sorted.reverse();
}

function parseTopicsList(state, list) {

    // если первичная загрузка
    if (!state.list.length) {
        return sort(list, state.sortField, state.sortOrder)
    } else {

    }
}