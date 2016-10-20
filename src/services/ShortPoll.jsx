/**
 * Created by lerayne on 16.04.16.
 */

import {serverURL, pollIntervalActive, pollIntervalPassive} from 'global-config';

export default class ShortPoll {
    constructor(options = {}) {

        const defaultOptions = {
            serverURL,
            pollIntervalActive,
            pollIntervalPassive
        };
        
        this.options = {...defaultOptions, ...options};
        
        this.connectionActive = false;
        this.timeoutHandle = false;
        this.request = false;
        this.connectionLossTO = false;
        this.setModePassive();

        this.subscriptions = [];
        this.actions = [];
        this.meta = {};
    }

    setModeActive(){
        this.pollInterval = this.options.pollIntervalActive;
        // we have to re-send query right after mode change, cause user watches the window and
        // timeout is changed from long to short
        this.refresh();
    }

    setModePassive(){
        // we don't have to re-send a query, it will run on schedule, using a new timeout value
        this.pollInterval = this.options.pollIntervalPassive;
    }
    
    start(){
        if (this.connectionActive){
            this.sendRequest();
        }
    }

    sendRequest(){

        if (this.request || this.timeoutHandle){
            this.cancelRequest()
        }

        this.request = this.query({
            subscribe: this.subscriptions,
            write: this.actions,
            meta:  this.meta
        }).then(::this.onRequestSuccess, ::this.onRequestFailure)
    }

    cancelRequest(){
        // cancelling upcoming query
        clearTimeout(this.timeoutHandle);
        this.timeoutHandle = false;

        // resetting connection loss timer
        clearTimeout(this.connectionLossTO);
        this.connectionLossTO = false;

        // if the request is still pending - cancelling it
        if (this.request){
            // todo - check how this should work with fetch
            this.request.done(::this.onAbort);
            this.request.abort();
            this.request = false;

            console.info('ShortPoll: request aborted while pending');
        }
    }

    onRequestSuccess(response){

    }

    onRequestFailure(error){
        console.error(error)
    }
    
    query(){
        
    }
    
    setModeActive(){
        this.pollInterval = this.options.pollIntervalActive;
        this.refresh();
    }

    setModePassive(){
        this.pollInterval = this.options.pollIntervalPassive;
    }

    onAbort(){

    }

    write(){

    }

    refresh(){

    }

    subscribe(){

    }
}