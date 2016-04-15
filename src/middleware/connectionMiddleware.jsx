/**
 * Я подумал и решил, что движок соединения, согласно парадигме редукс, должен быть миддлвером
 * 
 * Created by lerayne on 16.04.16.
 */

import { fetchAllRequest } from '../actions/global';

export default function connectionMiddleware (options) {
    return store => next => action => {
        
        // если экшн не нашего типа - просто пропускаем его дальше
        if (!action.meta || !action.meta.connection) {
            return next(action)
        }

        console.log('state before', store.getState());

        store.dispatch(fetchAllRequest());

        console.log('state after', store.getState());
        
        console.log('connection action:', action)
    }
}