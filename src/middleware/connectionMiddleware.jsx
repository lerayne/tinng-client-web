/**
 * Я подумал и решил, что движок соединения, согласно парадигме редукс, должен быть миддлвером
 * 
 * Created by lerayne on 16.04.16.
 */

import { fetchAllRequest } from '../actions/global';

export default function connectionMiddleware (store) {
    return next => action => {
        
        // если экшн не нашего типа - просто пропускаем его дальше
        if (!action.meta || !action.meta.connection) {
            return next(action)
        }
        
        store.dispatch(fetchAllRequest());
        
        console.log('connection action:', action)
    }
}