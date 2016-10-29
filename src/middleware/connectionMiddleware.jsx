/**
 * Я подумал и решил, что движок соединения, согласно парадигме редукс, должен быть миддлвером
 * 
 * Created by lerayne on 16.04.16.
 */

import Connection from '../services/Connection';

import { fetchAllRequest, fetchAllResponse } from '../actions/global';

export default function connectionMiddleware (options) {
    return store => {

        const connection = new Connection(store.dispatch);

        return nextMiddleware => action => {

            // если экшн не нашего типа - просто пропускаем его дальше
            if (action.subscription == undefined) {
                return nextMiddleware(action)
            }

            console.log('connection action:', action);

            if (action.subscription === true) {
                connection.start();
                return nextMiddleware(action);
            }

            if (action.subscription === false) {
                connection.stop();
                return nextMiddleware(action);
            }

            const {name, turn, contentType, onReceiveData} = action.subscription;
            const {payload} = action;

            switch (turn){
                case 'on':
                    connection.subscribe(name, contentType, payload, onReceiveData);
                    break;

                case 'off':
                    connection.cancelSubscription(name);
                    break;

                case 're':
                    connection.updateSubscription(name, payload);
                    break;

                default:
            }

            return nextMiddleware(action);
        }
    }
}