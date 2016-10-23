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

        this.subscriptions = {};
        this.actions = [];
        this.meta = {};
    }
    
    //INTERFACE METHODS

    /**
     * Запускает соединение.
     */
    start(){
        if (!this.connectionActive){
            this.connectionActive = true;
            this.reStartPolling();
        }
    }

    /**
     * Останавливает соединение. Когда соединение остановлено методы subscribe, updateSubscription 
     * не вызывают запросов к серверу, а лишь обновляют список подписок
     */
    stop(){
        if (this.connectionActive){
            this.connectionActive = false;
            this.stopPolling();
        }
    }

    /**
     * Посылает единичный запрос к серверу, возвращает Promise. Данный запрос может быть послан
     * даже если соединение остановлено
     *
     * @param channel
     * @param data
     * @returns {fetch Promise}
     */
    query(channel, data){
        // todo - разобраться с безопасностью этого запроса
        
        return fetch(`${serverURL}/_${channel}/`,{
            method: 'POST',
            credentials:'include',
            mode:'cors',
            cache:'no-cache',
            body:data
        }).then(response => {
            // todo - сделать обработку ошибок
            response.json()
        })
    }

    /**
     * Посылает единичный _пишущий_ запрос к серверу. Может быть отправлен даже если соединение
     * остановлено
     */
    write(){

    }

    /**
     * Обновляет подключение. В случае со схемой short poll - перезапускает запрос к серверу с 
     * новыми параметрами. Используется каждый раз после изменения списка подписок
     */
    refresh(){
        if (this.connectionActive){
            this.reStartPolling();
        }
    }

    /**
     * Создает подписку на контент.
     *
     * @param name - уникальное имя-идентификатор подписки. По нему можно обновлять и удалять
     * подписку
     * @param contentType - на какой контент подписываемся. Нужно серверу
     * @param payload - подробности, параметры подписки
     * @param onReceiveData - сохраняемый коллбек, который нужно вызвать при прибытии новых данных
     */
    subscribe(name, contentType, payload, onReceiveData){
        console.log('ShortPoll.subscribe', name, contentType, payload, onReceiveData);

        this.subscriptions[name] = {
            name,
            contentType,
            payload,
            onReceiveData
        };

        this.refresh();
    }

    cancelSubscription(name){

    }

    updateSubscription(name, payload){

    }
    
    // LOCAL METHODS

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

    /**
     * Начинает опрашивать сервер
     */
    reStartPolling(){

        if (this.request || this.timeoutHandle){
            this.stopPolling()
        }

        this.request = this.query('update', {
            subscribe: this.subscriptions,
            write: this.actions,
            meta:  this.meta
        }).then(::this.onRequestSuccess, ::this.onRequestFailure)
    }

    stopPolling(){
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
    
    setModeActive(){
        this.pollInterval = this.options.pollIntervalActive;
        this.refresh();
    }

    setModePassive(){
        this.pollInterval = this.options.pollIntervalPassive;
    }

    onAbort(){

    }
}