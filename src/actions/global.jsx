/**
 * Created by lerayne on 16.04.16.
 */

export const START_CONNECTION = 'START_CONNECTION';

export function startConnection(){
    return {
        type: START_CONNECTION,
        subscription: true
    }
}

export const STOP_CONNECTION = 'STOP_CONNECTION';

export function stopConnection(){
    return {
        type: STOP_CONNECTION,
        subscription: false
    }
}


export const FETCH_ALL_REQUEST = 'FETCH_ALL_REQUEST';

export function fetchAllRequest(){
    return {
        type: FETCH_ALL_REQUEST,
    }
}

export const FETCH_ALL_RESPONSE = 'FETCH_ALL_RESPONSE';


export function fetchAllResponse(){
    return {
        type: FETCH_ALL_RESPONSE
    }
}