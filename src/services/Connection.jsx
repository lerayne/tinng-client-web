/**
 * Created by lerayne on 16.04.16.
 */

import ShortPoll from './ShortPoll';

import { initialFetchAll } from '../actions/global';

//тут будет выбор типа подключени в зависимости от условий
const ConnectionType = ShortPoll;

export default class Connection extends ConnectionType {
    constructor(dispatch, options){
        super(options);
        
        this.dispatch = dispatch;
    }

    /**
     * Далее идет интерфейс класса - эти объявления нужны только для того, чтобы явно объявить требования к методам
     * класса ConnectionType
     */

    // одноразовый запрос
    query(...args){ super.query(...args) }

    // одноразовая запись
    write(...args){ super.write(...args) }
}