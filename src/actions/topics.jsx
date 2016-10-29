/**
 * Created by lerayne on 16.04.16.
 */

export function refreshTopicsList (){
    
}

export const SUBSCRIBE_TOPICS = 'SUBSCRIBE_TOPICS';
export const SUBSCRIBE_TOPICS_ERROR = 'SUBSCRIBE_TOPICS_ERROR';
export const SUBSCRIBE_TOPICS_SUCCESS = 'SUBSCRIBE_TOPICS_SUCCESS';
export const TOPICS_RECEIVE = 'TOPICS_RECEIVE';

export function receiveTopics(list, actions){
    return {
        type: TOPICS_RECEIVE,
        payload:{
            list
        }
    }
}