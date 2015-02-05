/**
 * Created by Michael on 20.12.2014.
 */

// tinng global scope root var
window.tinng = {

	units:[],

	state:{},

	class: {
		strategic: {}
	},

	lang:{
		languages:{},
		locale:'',
		textDefault:{},
		textLocalized:{}
	},

	service:{
		startupCalls:[]
	}
};

// get localized string or english or just key if both absent
window.text = function(key){
	return tinng.lang.textLocalized[key] ? tinng.lang.textLocalized[key] : (tinng.lang.textDefault[key] ? tinng.lang.textDefault[key] : key);
};

(function(){

	var languages = [];

	var getLanguage = function(lang){

		return new Promise(function(resolve){

			if (tinng.lang.languages[lang]) {
				resolve(tinng.lang.languages[lang])
			} else {
				Promise.resolve($.getJSON('./i18n/'+lang+'.json')).then(function(json){

					tinng.lang.languages[lang] = json;
					tinng.lang.locale = lang;
					resolve(json)

				}, function(){
					//if language not found
					if (languages.length) {
						//chain request next language
						resolve(getLanguage(languages.shift()))
					} else {
						resolve({});
					}
				});
			}
		});
	};

	// default language
	var defaultLangRequest = getLanguage('en').then(function(lang){
		tinng.lang.textDefault = tinng.lang.languages[tinng.lang.locale];

		if (window.navigator && navigator.languages) {

			languages = _(navigator.languages).clone();

			var localLangRequest = getLanguage(languages.shift()).then(function(lang){
				tinng.lang.textLocalized = tinng.lang.languages[tinng.lang.locale];
			});
			tinng.service.startupCalls.push(localLangRequest);
		}
	});
	tinng.service.startupCalls.push(defaultLangRequest);

	// language detection


})();


