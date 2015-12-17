/**
 * Created by Michael on 20.12.2014.
 */

// tinng global scope root var
window.tinng = {

	// current window interface blocks, called Units (a.k.a. widgets)
	units:[],

	// global app state vars, like "windowFocused"
	state:{},

	// prototype classes
	class: {
		strategic: {} // todo - deside if it's necessary
	},

	// polymer behaviors for inheritance by polymer modules
	polymerBehavior:{},

	// localization
	lang:{
		languages:{},
		locale:'',
		textDefault:{},
		textLocalized:{}
	},

	// other global vars
	service:{
		startupAsyncsQueue:[]
	},

	// configuration
	cfg:{}
};

//GLOBALS (most needed functions, as an exception)

// get localized string or english or just key if both absent
window.text = function(key){
	return tinng.lang.textLocalized[key] || tinng.lang.textDefault[key] || key;
};

// todo - rough localization engine. Review!
(function(){

	var languages = [];

	var getLanguage = function(languages){

		return new Promise(function(resolve, reject){

			var lang = languages.shift();

			if (tinng.lang.languages[lang]) {
				resolve(lang)
			} else {
				Promise.resolve($.getJSON('./app/i18n/'+lang+'.json')).then(function(json){

					tinng.lang.languages[lang] = json;
					resolve(lang)

				}, function(){
					//if language not found
					if (languages.length) {
						//chain request next language
						resolve(getLanguage(languages))
					} else {
						resolve({});
					}
				});
			}
		});
	};

	// default language
	var defaultLangRequest = getLanguage(['en']).then(function(lang){
		tinng.lang.textDefault = tinng.lang.languages[lang];
	});
	tinng.service.startupAsyncsQueue.push(defaultLangRequest);

	// language detection
	if (window.navigator && navigator.languages) {

		languages = _(navigator.languages).clone();

		var localLangRequest = getLanguage(languages).then(function(lang){
			tinng.lang.locale = lang;
			tinng.lang.textLocalized = tinng.lang.languages[lang];
		});
		tinng.service.startupAsyncsQueue.push(localLangRequest);
	}
})();


