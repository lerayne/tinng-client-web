/**
 * Я подумал и решил, что движок соединения, согласно парадигме редукс, должен быть миддлвером
 * 
 * Created by lerayne on 16.04.16.
 */

import { fetchAllRequest, fetchAllResponse } from '../actions/global';

export default function connectionMiddleware (options) {
    return store => nextMiddleware => action => {
        
        // если экшн не нашего типа - просто пропускаем его дальше
        if (!action.meta || !action.meta.connection) {
            return nextMiddleware(action)
        }

        console.log('CONNECTION MIDDLEWARE');
        console.log('state before', store.getState());

        store.dispatch(fetchAllRequest());

        fetch(options.serverURL).then(response => {
            console.log('server responsded', response)

            store.dispatch(fetchAllResponse())
        })

        console.log('state after', store.getState());
        
        console.log('connection action:', action)
    }
}