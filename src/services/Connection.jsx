/**
 * Created by lerayne on 16.04.16.
 */

import ShortPoll from './ShortPoll';

import {initialFetchAll} from '../actions/global';

//тут будет выбор типа подключени в зависимости от условий
const ConnectionType = ShortPoll;

export default class Connection extends ConnectionType {
    constructor(options = {}) {
        super(options);

        // запрос необходимых методов родительского класса
        [
            'start',
            'stop',
            'query',
            'write',
            'refresh',
            'subscribe',
            'cancelSubscription',
            'updateSubscription'
        ].forEach(methodName => {
            if (typeof super[methodName] != 'function') {
                throw(`Implementation of Connection class must have the "${methodName}" method`)
            }
        })
    }
}