/**
 * Created by lerayne on 16.04.16.
 */

export const TOPICS_SUBSCRIBE = 'TOPICS_SUBSCRIBE';
export const TOPICS_RECEIVE = 'TOPICS_RECEIVE';

export function subscribeOnTopics(name, searchString = null) {
    return {
        type: TOPICS_SUBSCRIBE,
        subscription: {
            name,
            contentType: 'topics',
            turn: 'on',
            onReceiveData: receiveTopics
        },
        payload: {
            searchString
        }
    }
}

export function receiveTopics(list, actions) {
    return {
        type: TOPICS_RECEIVE,
        payload: {
            list
        }
    }
}