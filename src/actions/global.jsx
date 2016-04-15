/**
 * Created by lerayne on 16.04.16.
 */

export const START_CONNECTION = 'START_CONNECTION';

export function startConnection(){
    return {
        type: START_CONNECTION,
        meta: {
            connection: true
        }
    }
}


export const FETCH_ALL_REQUEST = 'FETCH_ALL_REQUEST';

export function fetchAllRequest(){
    return {
        type: FETCH_ALL_REQUEST,
    }
}