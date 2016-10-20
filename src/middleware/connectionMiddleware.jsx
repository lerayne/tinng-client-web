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
            if (!action.subscription) {
                return nextMiddleware(action)
            }

            console.log('CONNECTION MIDDLEWARE');
            console.log('connection action:', action)
            //console.log('state before', store.getState());

            store.dispatch(fetchAllRequest());

            switch (action.subscribe.turn){
                case 'on':
                    break;

                case 'off':
                    break;

                case 're':
                    break;

                default:
            }

            fetch(options.serverURL + '/_update/', {mode:'cors'}).then(resp => resp.json()).then(json => {
                console.log('server responsded', json);

                store.dispatch(fetchAllResponse())
            });

            //console.log('state after', store.getState());
        }
    }
}