/**
 * Created with JetBrains PhpStorm.
 * User: M. Yegorov
 * Date: 11/14/13
 * Time: 6:12 PM
 * To change this template use File | Settings | File Templates.
 */

tinng.protos.strategic.XHRShortPoll = function(server, callback, autostart){
	t.funcs.bind(this);

	this.serverURL = server;
	this.parseCallback = callback;

	this.active = autostart;
	this.setMode('passive');
	this.request = false; // запрос
	this.timeout = false; // текущий таймаут
	this.connectionLossTO = false; // таймаут обрыва связи

	this.$stateIndicator = $('.state-ind');

	this.subscriptions = {};
	//console.log('XHRShortPoll construct meta init')
	this.meta = {};
	this.actions = {};
	this.latest_change = 0;
}

tinng.protos.strategic.XHRShortPoll.prototype = {

	// интерфейсные методы
	refresh:function(){
		return this.subscriptionSend();
	},

	setMode:function(mode){

		switch (mode){
			case 'active':
				this.waitTime = t.cfg['poll_timer'];
				this.refresh();

				break;

			case 'passive':
				this.waitTime = t.cfg['poll_timer_blurred'];

				break;
		}
	},

	write:function(params){

		if (params instanceof Array) this.actions = params;
		else this.actions[0] = params;

	},

	// внутренний класс подписки, которым пользуются внешние классы (пере)подписки и ее изменения
	_subscribe:function(subscriberId, feedName, feed, reset){
		var subscriberFeeds = this.subscriptions[subscriberId];

		// если такой подписчик уже есть
		if (subscriberFeeds) {

			// если такая подписка уже есть у подписчика
			if (subscriberFeeds[feedName]){
				for (var key in feed) {
					subscriberFeeds[feedName][key] = feed[key];
				}

				// сбрасываем ее мету
				if (reset && this.meta[subscriberId]) {
					//console.log('META RESET on subscribe:', subscriberId, feedName)
					this.meta[subscriberId][feedName] = {};
				}

				// иначе создаем новую подписку
			} else subscriberFeeds[feedName] = feed;

		} else { // иначе создаем подписчика и подписку у него
			this.subscriptions[subscriberId] = {};
			this.subscriptions[subscriberId][feedName] = feed;
		}
	},

	// подписывает, или изменяет параметры текущей подписки
	subscribe:function(subscriberId, feedName, feed){
		this._subscribe(subscriberId, feedName, feed, true)
	},

	// "мягко" изменяет параметры подписки, не меняя ее метаданные
	// пока-что нужно для динамической подгрузки "страниц"
	rescribe:function(subscriberId, feedName, feed){
		this._subscribe(subscriberId, feedName, feed, false)
	},

	// отменяет подписку
	unscribe:function(subscriberId, feedName){

		// если такой вообще есть
		if (this.subscriptions[subscriberId] && this.subscriptions[subscriberId][feedName]) {

			delete this.subscriptions[subscriberId][feedName];

			if (this.meta[subscriberId]) {
				//console.log('META DELETE on UNscribe:', subscriberId, feedName)
				delete this.meta[subscriberId][feedName];
			}

			// считаем, сколько подписок осталось
			var i = 0;
			for (var key in this.subscriptions[subscriberId]) {
				/*if (this.subscriptions[subscriberId].propertyIsEnumerable(key))*/ i++;
			}

			// если ни одной - прибиваем подписчика
			if (i == 0) {
				delete this.subscriptions[subscriberId];

				//console.log('SUBSCRIBER DELETE:', subscriberId)
				delete this.meta[subscriberId];
			}
		}
	},




	start:function(){
		if (!this.active) {
			this.active = true;
			this.subscriptionSend();
		}
	},

	stop:function(){
		if (this.active) {
			this.active = false;
			this.subscriptionCancel();
		}
	},

	// отправка запроса
	subscriptionSend:function () {
		if (this.active && t.cfg.maintenance == 0) setTimeout(this.$_subscriptionSend, 0);
		return true;
	},

	// todo: этот враппер-таймаут нужен из-за несовершенства обертки XHR, баг вылазит во время создания новой темы -
	// отправка запроса сразу после получения предыдущего происходит до закрытия соединения и новое соединение не проходит
	$_subscriptionSend:function(){

		//t.notifier.send('connection start', this.waitTime);

		// останавливаем предыдущий запрос/таймер если находим
		if (this.request || this.timeout) this.subscriptionCancel();

		this.startIndication(); // показываем, что запрос начался

		//console.log('this.subscriptions:', this.subscriptions);
		// var now = new Date();
		//if (!t.funcs.objectSize(this.meta)) console.log(now.getTime()+' META EMPTY!');

		this.request = this.query('update', this.onResponse, {
			subscribe: this.subscriptions,
			write: this.actions,
			meta:  this.meta
		});

		// если соединение длится 20 секунд - признаем его оборвавшимся
		this.connectionLossTO = setTimeout(this.retry, 20000);

		//t.funcs.log('Launching query with timeout ' + this.waitTime);
	},

	query:function(channel, callback, data){

		data.user = {
			login: t.funcs.getCookie('login'),
			pass: t.funcs.getCookie('pass')
		}

		return $.ajax({
			type:'post',
			url: this.serverURL+'/_'+channel+'/',
			cache: false,
			crossDomain: true,
			success: function(response){

				if (response.debug) {
					console.info('PHP backtrace:\n==============\n', response.debug)
				}

				callback(response.data);
			},
			error: function(a, b, c){
				console.warn('XHR error:', a, b, c);
			},
			dataType:'json',
			data:data
		});
	},

	retry:function(){
		t.ui.showMessage(t.txt.connection_error);
		console.warn('Registered connection loss. Trying to restart')
		this.subscriptionCancel();
		this.subscriptionSend();
	},

	// Останавливает ротор
	subscriptionCancel:function () {

		this.timeout = t.funcs.advClearTimeout(this.timeout);

		clearTimeout(this.connectionLossTO);

		if (this.request) {
			// переопределяем, иначе rotor воспринимает экстренную остановку как полноценное завершение запроса
			this.request.done(this.onAbort);
			this.request.abort();
			this.request = false;

			console.info('Connection STOP occured while waiting. Previous query has been aborted');
		}

		return true;
	},

	// Выполняется при удачном возвращении запроса
	onResponse:function (data) {

		clearTimeout(this.connectionLossTO);

		// todo - иногда от сервера приходит meta в виде массива, а иногда - в виде объекта. разобраться
		if (data.meta instanceof Array) {

			this.meta = {};
			for (var i = 0; i < data.meta.length; i++) {
				var metaItem = data.meta[i];
				this.meta[i] = metaItem;
			}
		} else {
			this.meta = data.meta;
		}

		// разбираем пришедший пакет и выполняем обновления
		this.parseCallback(data, this.actions);

		this.actions = {};

		this.stopIndication(); // индикация ожидания откл
		this.request = false;

		// перезапускаем запрос
		this.timeout = setTimeout(this.subscriptionSend, this.waitTime);
	},

	// Выполняется при принудительном сбросе запроса
	onAbort:function () {
		this.stopIndication();
	},

	// как-то отмечаем в интерфейсе что запрос ушел
	startIndication:function () {
		this.$stateIndicator.addClass('updating');
	},

	// как-то отмечаем в интерфейсе что запрос закончен
	stopIndication:function () {
		this.$stateIndicator.removeClass('updating');
	}
}