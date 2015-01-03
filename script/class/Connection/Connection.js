/**
 * Created with JetBrains PhpStorm.
 * User: M. Yegorov
 * Date: 11/14/13
 * Time: 6:11 PM
 * To change this template use File | Settings | File Templates.
 */

// в данной реализации класс абсолютно закрывает содержимое внутреннего, но возможна и иная комбирация - в этом случае
// нужен return new InternalClass() в конструкторе. Само собой, возможна и полузакрытая схема
tinng.class.Connection = function (config) {

	this.subscribers = [];
	this.parseCallbacks = {};

	// настройки по умолчанию и их перегрузка
	this.conf = tinng.funcs.objectConfig(config, this.defaultConf = {
		server:'',
		autostart:true,
		callback:function(){}
	});

	// заглушка на определение класса, который должен будет исполнять роль connection
	if (true) {
		this.wrappedClass = tinng.class.strategic.XHRShortPoll;
		this.wrappedClassName = 'tinng.class.strategic.XHRShortPoll';
	}
	var wrapped = new this.wrappedClass(this.conf.server, this.onResponse.bind(this), this.conf.autostart);
	this.engine = wrapped;

	// проверка встроенного класса на совместимость

	var requiredMethods = [
		'write',
		'subscribe',
		'rescribe',
		'unscribe',
		'stop',
		'start'
	];

	for (var j = 0; j < requiredMethods.length; j++) {
		var methodName = requiredMethods[j];

		if (typeof this.wrappedClass[methodName] != 'function' && typeof this.wrappedClass.prototype[methodName] != 'function') {
			console.error('Strategic wrapper error: method '+ methodName +' is not present in strategic class '+ this.wrappedClassName);
		}
	}





	// осуществляет запись данных на сервер
	this.write = function(){
		wrapped.write.apply(wrapped, arguments);

		return this.refresh();
	};

	// делает простой запрос на сервер
	this.query = function(){
		return wrapped.query.apply(wrapped, arguments);
	};

	// подписывает объект на новый фид, или редактирует значение существующего, сбрасывая внутренее состояние подписки (meta)
	// может принимать объект с полями subscriber, feedName и  feed, массив таких объектов, или просто аргументы в таком порядке
	this.subscribe = function(){
		this._subscribe(wrapped, 'subscribe', arguments);

		return this.refresh();
	};

	// мягко изменяет параметры подписки, не сбрасывая ее внутреннее состояние (meta)
	// может принимать объект с полями subscriber, feedName и  feed, массив таких объектов, или просто аргументы в таком порядке
	this.rescribe = function(){
		this._subscribe(wrapped, 'rescribe', arguments);

		return this.refresh();
	};

	// эти методы проводят ту же самую подписку, только не форсируют подключение сразу послее ее оформления, т.е. новые
	// параметры будут переданы на сервер при любой ближайшей передаче. Т.н. "отложенная" подписка
	this.softSubscribe = function(){
		this._subscribe(wrapped, 'subscribe', arguments);
	};

	this.softRescribe = function(){
		this._subscribe(wrapped, 'rescribe', arguments);
	};

	// todo - возможно, стоит сделать отдельно мягкую подписку и переподписку, чтобы принудительно очищать вспомогатьельные и необязательные парамтеры
	// ну и вообще подумать о назначении и правилах действия методов

	// удаляет подписку
	// может принимать объект с полями subscriber и feedName,  массив таких объектов, или просто аргументы в таком порядке
	this.unscribe = function() {
		this._subscribe(wrapped, 'unscribe', arguments);

		//вроде как здесь не обязательно, потому что отписка не подразумевает возвращения данных
		//если так - это сильно упрощает работу :)
		//return this.refresh();
	};




	// вызывается внутри некоторых активных методов. Не требует обязательной реализации во внутреннем классе
	// например при шорт-поллинге этот метод сразу отправляет новый запрос после любого изменения
	this.refresh = function(){
		if (wrapped.refresh) return wrapped.refresh.apply(wrapped, arguments);
		else return false;
	};

	// начинает/возобновляет работу соединения
	this.start = function(){
		return wrapped.start.apply(wrapped, arguments)
	};

	// приостанавливает соединение
	this.stop = function(){
		return wrapped.stop.apply(wrapped, arguments)
	};

	this.setMode = function() {
		if (wrapped.setMode) wrapped.setMode.apply(wrapped, arguments);
	}
};

tinng.class.Connection.prototype = {
	subscriberId:function(object){
		if (this.subscribers.indexOf(object) == -1) {
			this.subscribers.push(object)
		}

		return	this.subscribers.indexOf(object)
	},

	// todo - maybe move this to wrapped class, so the "refreshes" can be moved there too
	_subscribe: function(object, funcName, args){
		var that = this;

		var subscribe = function(params){
			var id = that.subscriberId(params.subscriber);

			// memorize parse callbacks in this object
			if (!that.parseCallbacks[id]){ that.parseCallbacks[id] = []; }
			that.parseCallbacks[id][params.feedName] = params.parser.bind(params.subscriber);

			//that['copy_'+funcName](id, params.feedName, params.feed); //useless?
			object[funcName].call(object, id, params.feedName, params.feed);
		};

		if (args.length > 1) {
			subscribe({subscriber:args[0], feedName:args[1], feed:args[2]})
		} else if (args[0] instanceof Array) {
			_(args[0]).each(subscribe)
		} else if (args[0] instanceof Object){
			subscribe(args[0])
		}
	},


	onResponse:function(result, actions){
		var that = this;

		if (!!result.feeds){

			_(result.feeds).each(function(feeds, id){

				for (var feedName in feeds) {
					that.parseCallbacks[id][feedName](feeds[feedName]);
				}
			})
		}
	},

	// todo - investigate the necessity of this copying
	// создает копию подписки в объекте-подписчике
	copy_subscribe:function(subscriberId, feedName, feed){

		var subscriberFeeds = this.subscribers[subscriberId].subscriptions;

		// если такой подписчик уже есть
		if (subscriberFeeds) {

			if (subscriberFeeds[feedName]) {
				for (var key in feed) subscriberFeeds[feedName][key] = feed[key];
			} else {
				subscriberFeeds[feedName] = feed;
			}

		} else { // иначе создаем подписчика и подписку у него
			this.subscribers[subscriberId].subscriptions = {};
			this.subscribers[subscriberId].subscriptions[feedName] = feed;
		}
	},

	copy_rescribe:function(){
		this.copy_subscribe.apply(this, arguments);
	},

	// удаляет копию подписки в объекте-подписчике
	copy_unscribe:function(subscriberId, feedName){
		var subscriber = this.subscribers[subscriberId];

		if (subscriber.subscriptions && subscriber.subscriptions[feedName])
			delete this.subscribers[subscriberId].subscriptions[feedName];

	}
}