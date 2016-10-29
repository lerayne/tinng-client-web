/**
 * Created by lerayne on 16.04.16.
 */

import delay from 'delay'

import {serverURL, pollIntervalActive, pollIntervalPassive} from 'global-config'
import {transformFromLegacyResponse, transformToLegacyBody} from './legacyConverters'

export default class ShortPoll {

    constructor(options = {}) {

        const defaultOptions = {
            serverURL,
            pollIntervalActive,
            pollIntervalPassive
        }

        this.options = {...defaultOptions, ...options}

        this.connectionActive = false
        this.timeoutHandle = false
        this.cancelRequest = false
        this.setModeActive() // todo - стартовать в пассивном режиме, если окно неактивно

        this.subscriptions = {}
    }

    //INTERFACE METHODS

    /**
     * Запускает соединение.
     */
    start() {
        console.log('connection START!')

        if (!this.connectionActive) {
            this.connectionActive = true
            this.poll()
        }
    }

    /**
     * Останавливает соединение. Когда соединение остановлено методы subscribe, updateSubscription
     * не вызывают запросов к серверу, а лишь обновляют список подписок
     */
    stop() {
        console.log('connection STOP!')

        if (this.connectionActive) {
            this.stopPolling()
            this.connectionActive = false
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
    async query(channel, data) {
        // todo - разобраться с безопасностью этого запроса

        try {
            const fetchPromise = fetch(`${this.options.serverURL}/_${channel}/`, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                cache: 'no-cache',
                body: JSON.stringify(data)
            })

            const cancelPromise = new Promise(async(resolve, reject) => {
                this.cancelRequest = () => resolve({cancelled: true})
                await delay(3000)
                reject('connection_timeout')
            })

            // выполнится первый из двух промисов. Таким образом реализована отмена запроса
            const fetchResponse = await Promise.race([fetchPromise, cancelPromise])

            // какой бы не выполнился - сразу стираем отменяющую функцию
            this.cancelRequest = false

            if (fetchResponse.ok) {

                const json = await fetchResponse.json()

                if (json.debug) {
                    console.info('PHP backtrace:\n==============\n', json.debug)
                }

                // в идеале вывода PHP быть не должно, если есть - значит есть ошибка
                if (json.php_message) {
                    console.error('PHP ERROR:\n============\n', json.php_message)
                }

                return json

            } else if (fetchResponse.cancelled) {

                return false
            }

        } catch (error) {
            console.error('ShortPoll.query ERROR:', error, error.stack)

            throw error
        }
    }

    /**
     * Посылает единичный _пишущий_ запрос к серверу. Учитвает состояние поллера, НЕ может быть
     * отправлен если соединение остановлено
     */
    write(params) {

        if (!params instanceof Array) {
            params[0] = params
        }

        this.refresh(params)
    }

    /**
     * Обновляет подключение. В случае со схемой short poll - перезапускает запрос к серверу с
     * новыми параметрами. Используется каждый раз после изменения списка подписок
     */
    refresh(...args) {
        if (!!args.actions && !this.connectionActive) {
            // todo - сделать оповещение
            console.warn('Connection is stopped. Write request has not been sent!')
        }

        if (this.connectionActive) {
            this.poll(...args)
        }
    }

    /**
     * Создает подписку на контент.
     *
     * @param name - уникальный идентификатор подписки. По нему ее можно обновлять и удалять
     * @param contentType - на какой контент подписываемся. Нужно серверу
     * @param payload - подробности, параметры подписки
     * @param onReceiveData - сохраняемый коллбек, который нужно вызвать при прибытии новых данных
     */
    subscribe(name, contentType, payload, onReceiveData) {

        this.subscriptions[name] = {
            name,
            contentType,
            payload,
            onReceiveData,
            meta: {}
        }

        this.refresh()
    }

    /**
     * Отменяет подписку по имени
     *
     * @param name
     */
    cancelSubscription(name) {
        if (this.subscriptions[name]) {
            delete this.subscriptions[name]
        }

        //refresh не нужен, следующий запрос просто уйдет без этой подписки
    }

    /**
     * Обновляет существующую подписку без сброса её внутренних метаданных. Используется, например,
     * для "догрузки" контента. Возможно указание только изменившихся параметров в payload
     *
     * @param name
     * @param payload
     */
    updateSubscription(name, payload) {
        if (this.subscriptions[name]) {
            this.subscriptions[name] = {
                ...this.subscriptions[name],
                payload: {
                    ...this.subscriptions[name].payload,
                    ...payload
                }
            }
        }

        this.refresh()
    }

    // LOCAL METHODS

    setModeActive() {
        this.pollInterval = this.options.pollIntervalActive
        // we have to re-send query right after mode change, cause user watches the window and
        // timeout is changed from long to short
        this.refresh()
    }

    setModePassive() {
        // we don't have to re-send a query, it will run on schedule, using a new timeout value
        this.pollInterval = this.options.pollIntervalPassive
    }

    /**
     * Начинает опрашивать сервер
     *
     * @param actions - массив пишущих действий, выполняемых один раз
     */
    async poll(actions = false) {

        // todo - возможно это условие лишнее
        if (this.connectionActive) {
            console.log('executing poll with actions = ', actions)

            if (this.cancelRequest || this.timeoutHandle) {
                this.stopPolling()
            }

            try {
                let response = await this.query('update', transformToLegacyBody({
                    subscriptions: this.subscriptions,
                    actions: this.actions
                }))

                // отмененный запрос возвращает false
                if (response) {

                    response = transformFromLegacyResponse(response)

                    // вызываем коллбеки
                    if (response.data) {
                        for (let name in response.data) {
                            this.subscriptions[name].onReceiveData(response.data[name])
                        }
                    }

                    // перезаписываем метаданные
                    if (response.meta) {
                        for (let name in response.meta) {
                            this.subscriptions[name].meta = response.meta[name]
                        }
                    }

                    // рестартуем поллер
                    this.timeoutHandle = setTimeout(::this.poll, this.pollInterval)
                }
            } catch (error) {

                if (error == 'connection_timeout') {

                    console.warn('Сonnection lost. Trying to restart')
                    this.poll()

                } else {
                    console.error('ShortPoll.poll ERROR:', error.stack)
                }
            }
        } else {
            console.warn('trying to run poll when is connectionActive:false')
        }
    }

    /**
     * Останавливает поллер
     */
    stopPolling() {
        // cancelling upcoming query
        clearTimeout(this.timeoutHandle)
        this.timeoutHandle = false

        //cancelling current query if present
        if (this.cancelRequest) {
            this.cancelRequest()
        }
    }
}