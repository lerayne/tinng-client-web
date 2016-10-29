/**
 * Created with JetBrains PhpStorm.
 * User: M. Yegorov
 * Date: 11/14/13
 * Time: 6:12 PM
 * To change this template use File | Settings | File Templates.
 */

tinng.class.strategic.XHRShortPoll = function(server, callback, autostart){
	tinng.funcs.bind(this);

	this.serverURL = server;
	this.parseCallback = callback;

	this.active = autostart;
	this.setMode('passive');
	this.request = false; // запрос
	this.timeout = false; // текущий таймаут
	this.connectionLossTO = false; // таймаут обрыва связи

	this.subscriptions = {};
	this.meta = {};
	this.actions = {};
	this.latest_change = 0;
};

tinng.class.strategic.XHRShortPoll.prototype = {

	// интерфейсные методы
	// refresh:function(){
	// 	return this.subscriptionSend();
	// },

	// setMode: function (mode) {
	// 	//reimplemented
	// },

	// write:function(params){
    //
	// 	if (params instanceof Array) this.actions = params;
	// 	else this.actions[0] = params;
    //
	// },

	// внутренний класс подписки, которым пользуются внешние классы (пере)подписки и ее изменения
	// _subscribe:function(id, feedName, feed, reset){
    //
	// 	if (!this.subscriptions[id]) { this.subscriptions[id] = {}; }
	// 	if (!this.subscriptions[id][feedName]) { this.subscriptions[id][feedName] = feed; }
    //
	// 	// write all new params to this feed (iteration is to keep old params)
	// 	for (var key in feed) {
	// 		this.subscriptions[id][feedName][key] = feed[key];
	// 	}
    //
	// 	// (re)setting metadata
	// 	// todo - check if there's no problems with protocol if meta is being set on new subscription's creation
	// 	// note: meta[id] is being created on server side
	// 	if (reset && this.meta && this.meta[id]) {
	// 		this.meta[id][feedName] = {};
	// 	}
	// },

	// подписывает, или изменяет параметры текущей подписки
	// subscribe:function(id, feedName, feed){
	// 	this._subscribe(id, feedName, feed, true)
	// },
    //
	// // "мягко" изменяет параметры подписки, не меняя ее метаданные
	// // пока-что нужно для динамической подгрузки "страниц"
	// rescribe:function(id, feedName, feed){
	// 	this._subscribe(id, feedName, feed, false)
	// },

	// отменяет подписку
	// unscribe:function(id, feedName){
    //
	// 	// если такой вообще есть
	// 	if (this.subscriptions[id] && this.subscriptions[id][feedName]) {
    //
	// 		delete this.subscriptions[id][feedName];
    //
	// 		if (this.meta[id]) {
	// 			delete this.meta[id][feedName];
	// 		}
    //
	// 		// если это была последняя подписка - прибиваем подписчика и мету
	// 		if (_(this.subscriptions[id]).isEmpty()) {
	// 			delete this.subscriptions[id];
	// 			delete this.meta[id];
	// 		}
	// 	}
	// },




	// start:function(){
	// 	if (!this.active) {
	// 		this.active = true;
	// 		this.subscriptionSend();
	// 	}
	// },
    //
	// stop:function(){
	// 	if (this.active) {
	// 		this.active = false;
	// 		this.subscriptionCancel();
	// 	}
	// },

	// отправка запроса
	subscriptionSend: function () {

		if (this.active && tinng.cfg.maintenance == 0) {
			// todo: этот враппер-таймаут нужен из-за несовершенства обертки XHR, баг вылазит во
			// время создания новой темы - отправка запроса сразу после получения предыдущего
			// происходит до закрытия соединения и новое соединение не проходит
			setTimeout(this.$_subscriptionSend, 0);
		}
		// todo  - it can return more useful data!
		return true;
	},


	// $_subscriptionSend: function(){
    //
	// 	// останавливаем предыдущий запрос/таймер если находим
	// 	if (this.request || this.timeout) this.subscriptionCancel();
    //
	// 	this.request = this.query('update', this.onResponse, {
	// 		subscribe: this.subscriptions,
	// 		write: this.actions,
	// 		meta:  this.meta
	// 	});
    //
	// 	this.actions = {}; // actions have to be passed just once in any case!
    //
	// 	// если соединение длится 20 секунд - признаем его оборвавшимся
	// 	this.connectionLossTO = setTimeout(this.retry, 20000);
    //
	// 	//t.funcs.log('Launching query with timeout ' + this.waitTime);
	// },

	query:function(channel, callback, data){

		data.user = {
			login: tinng.funcs.getCookie('login'),
			password: tinng.funcs.getCookie('password')
		};

		return $.ajax({
			type:'post',
			url: this.serverURL+'/_'+channel+'/',
			cache: false,
			crossDomain: true,
			success: function(response){

				//console.log('response', response)

				if (typeof response != 'undefined' && response){
					if (response.debug) {
						console.info('PHP backtrace:\n==============\n', response.debug)
					}

					if (response.php_message){
						console.warn('PHP Message:\n============\n', response.php_message)
					}
				}

				if (callback) {
					callback(response);
				}
			},
			error: function(a, b, c){
				console.warn('XHR error:', a, b, c);
			},
			dataType:'json',
			data:data
		});
	},

	// retry:function(){
	// 	//todo t.ui.showMessage(t.txt.connection_error);
	// 	console.warn('Registered connection loss. Trying to restart');
	// 	this.subscriptionCancel();
	// 	this.subscriptionSend();
	// },

	// Останавливает ротор
	// subscriptionCancel:function () {
    //
	// 	this.timeout = tinng.funcs.advClearTimeout(this.timeout);
    //
	// 	clearTimeout(this.connectionLossTO);
    //
	// 	if (this.request) {
	// 		// переопределяем, иначе connection воспринимает экстренную остановку как полноценное завершение запроса
	// 		this.request.done(this.onAbort);
	// 		this.request.abort();
	// 		this.request = false;
    //
	// 		console.info('Connection STOP occured while waiting. Previous query has been aborted');
	// 	}
    //
	// 	return true;
	// },

	// Выполняется при удачном возвращении запроса
	onResponse:function (response) {
		var data = response.data;

		if (!_(this.actions).isEmpty()){
			console.log('actions', this.actions)
		}

		clearTimeout(this.connectionLossTO);

		// todo - иногда от сервера приходит meta в виде массива, а иногда - в виде объекта. разобраться
		if (data.meta instanceof Array) {

			this.meta = {};
			for (var i = 0; i < data.meta.length; i++) {
				this.meta[i] = data.meta[i];
			}
		} else {
			this.meta = data.meta;
		}

		// разбираем пришедший пакет и выполняем обновления
		this.parseCallback(data, this.actions);

		this.actions = {}; // this may not be needed 'cause actions are being cleaned in $_subscriptionSend

		this.request = false;

		// перезапускаем запрос
		this.timeout = setTimeout(this.subscriptionSend, this.waitTime);
	},

	// Выполняется при принудительном сбросе запроса
	onAbort:function () {
	}
};