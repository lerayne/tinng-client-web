/**
 * Created by lerayne on 16.04.16.
 */

import globalConfig from '../config';

export default class ShortPoll {
    constructor(options) {

        const defaultOptions = {
            serverURL: globalConfig.serverURL,
            pollIntervalActive: globalConfig.pollIntervalActive,
            pollIntervalPassive: globalConfig.pollIntervalPassive
        };
        
        this.options = {...defaultOptions, ...options};
        
        this.connectionActive = false;
        this.timeoutHandle = false;
        this.request = false;
        this.connectionLossTO = false;
        this.pollInterval = this.options.pollIntervalPassive;
        
    }
    
    start(){
        if (this.connectionActive){
            this.sendRequest();
        }
    }

    reStartRequest(){
        
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
}