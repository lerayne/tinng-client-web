/**
 * Created by lerayne on 16.04.16.
 */

import ShortPoll from './ShortPoll';

import { initialFetchAll } from '../actions/global';

export default class Connection extends ShortPoll {
    constructor(dispatch){
        this.dispatch = dispatch;
        
        
    }
}