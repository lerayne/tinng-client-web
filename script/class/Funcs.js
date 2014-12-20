/**
 * Created with JetBrains PhpStorm.
 * User: Michael Yegorov
 * Date: 7/11/12
 * Time: 2:43 PM
 * To change this template use File | Settings | File Templates.
 */

//todo - вынести отсюда функции работы с основной системой (сделать отдельный класс, или придумать куда распихать)

Funcs = function () {};

Funcs.prototype = {

	// функция ошибки сеттера для финальных свойств
	setterError:function () {
		throw('trying to overwrite final property');
	},


	// запись в консоль
	log:function (text) {


		if (t.cfg['logging']) {
			var date = new Date(), time;

			if (date.toLocaleFormat) {
				time = date.toLocaleFormat('%H:%M:%S');
			} else {
				var temp = {};
				temp.H = date.getHours();
				temp.M = date.getMinutes();
				temp.S = date.getSeconds();
				for (var i in temp) {
					if (temp[i] * 1 < 10) temp[i] = '0' + temp[i];
				}
				time = temp.H + ':' + temp.M + ':' + temp.S;
			}
			console.info(time + ' - ' + text);
		}
	},


	// обработчик таймаута
	advClearTimeout:function (timeout) {
		if (timeout) {
			this.log('timeout found: ' + timeout + '. cleared');
			clearTimeout(timeout);
		}
		return false;
	},


	// оздать таймстамп из строки с SQL
	sql2stamp:function (str) {
		if (!str) return false;
		var str1 = str.split(' ');
		var dates = str1[0].split('-');
		var times = str1[1].split(':');
		return new Date(dates[0], dates[1] - 1, dates[2], times[0], times[1], times[2]).getTime();
	},

	phpts2date:function(str) {
		var jsts = parseInt(str, 10) * 1000;
		return new Date(jsts);
	},

	stopProp:function (e) {
		e.stopPropagation();
//		var e = e || window.event;
//		e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
	},

	bind:function (context, funcNames) {
		/*
		 *  если funcNames:
		 * 	строка - указанная функция привязывается к контексту класса по ее имени
		 * 	массив строк - все функции, перечисленные по именам, привязываются к контексту класса
		 *	не подан - все функции прототипа класса привязываются к контексту класса
		 * */

		// собственно, функция привязки к контексту
		var _bind = function (funcName) {
			if (typeof context[funcName] == 'function') context[funcName] = context[funcName].bind(context);
		}

		switch (typeof funcNames) {
			// второй аргумент вообще не подан - привязываем все функции
			case 'undefined':

				for (var memberName in context) {
					// привязываем только функции НЕ начинающиеся с _ - эти функции будут с собственным this
					if (typeof context[memberName] == 'function' && memberName.indexOf('_') != 0) _bind(memberName);
				}

				break;
			// подан массив - привязываем все его элементы к контексту
			case 'object':

				for (var i = 0; i < funcNames.length; i++) _bind(funcNames[i]);

				break;
			// подана строка - привязываем одну функцию
			case 'string':
			default:

				_bind(funcNames);
		}
	},

	setCookie:function (config) {
		if (typeof config.name == 'undefined' || typeof config.value == 'undefined') return false;
		var str = config.name + '=' + encodeURIComponent(config.value);

		if (config.expires) str += '; expires=' + config.expires.toGMTString();

		//if (config.path)	str += '; path=' + config.path;
		// Всегда устанавливать куки в корень домена
		str += '; path=/';

		if (config.domain)  str += '; domain=' + config.domain;
		if (config.secure)  str += '; secure';

		document.cookie = str;
		return true;
	},

	getCookie:function (name) {
		var pattern = "(?:; )?" + name + "=([^;]*);?";
		var regexp = new RegExp(pattern);

		if (regexp.test(document.cookie))
			return decodeURIComponent(RegExp["$1"]);

		return false;
	},

	deleteCookie:function (config) {

		var newConfig = {
			name: (typeof config == 'string') ? config : config.name,
			value:'',
			expires:new Date(0)
		};

		if (typeof config == 'object'){
			if (typeof config.path != 'undefined') newConfig.path = config.path;
			if (typeof config.domain != 'undefined') newConfig.domain = config.domain;
		}

		this.setCookie(newConfig);
		return true;
	},

	objectConfig:function(argSettings, defaultSettings) {
		var settings = {};
		for (var key in defaultSettings) {
			//if (typeof debug_1 != 'undefined')  console.log(key, argSettings[key], defaultSettings[key])
			settings[key] = (typeof argSettings[key] != 'undefined') ? argSettings[key] : defaultSettings[key];
		}

		return settings;
	},

	stopPropagation:function(e){
		e.stopPropagation();
	},

	isEmptyObject:function(object){
		for (var key in object) {
			if (object.propertyIsEnumerable(key)) return false;
		}
		return true;
	},

	objectSize:function(object){
		var i = 0

		for (var key in object) {
			if (object.propertyIsEnumerable(key)) i++;
		}
		return i;
	},

	txt:function(key){
		return t.txt[key] ? t.txt[key] : key
	},

	getSortIndex:function(array, newValue, sortField, sortOrder, watchDirection){
		if (typeof sortOrder == 'undefined') sortOrder = 'asc';
		if (typeof watchDirection == 'undefined') watchDirection = 'asc';

		if (watchDirection == 'asc') {

			for (var i = 0; i < array.length; i++) {
				var item = array[i];

				if (sortOrder == 'asc' && newValue[sortField] < item[sortField]) break;
				if (sortOrder == 'desc' && newValue[sortField] >= item[sortField]) break;
			}

		} else {

			var i = array.length;
			while(i--){
				var item = array[i];

				if (sortOrder == 'asc' && newValue[sortField] >= item[sortField]) break;
				if (sortOrder == 'desc' && newValue[sortField] < item[sortField]) break;
			}

			i++;
		}

		return i;
	}
}

tinng.funcs = new Funcs();
