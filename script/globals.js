/**
 * Created by Michael on 20.12.2014.
 */

window.textDefault = {};
window.textLocalized = {};

// get localized string or english or just key if both absent
window.text = function(key){
	return textLocalized[key] ? textLocalized[key] : (textDefault[key] ? textDefault[key] : key);
};

// tinng global scope root var
tinng = {
	units:[],
	state:{},
	class: {
		strategic: {}
	}
};

window.startupCalls = [];

(function(){

	// default language
	var defaultLangRequest = Promise.resolve($.get('./i18n/en.json')).then(function(lang){
		textDefault = lang;
	});
	startupCalls.push(defaultLangRequest);

	// language detection
	if (window.navigator && navigator.languages) {

		var i = 0;

		var getLanguage = function(lang){

			return new Promise(function(resolve){

				if (lang == 'en') {
					resolve(textDefault)
				} else {
					Promise.resolve($.getJSON('./i18n/'+lang+'.json')).then(resolve, function(){
						//if language not found
						if (navigator.languages[++i]) {
							//chain request next language
							resolve(getLanguage(navigator.languages[i]))
						} else {
							//return default one (English)
							resolve(textDefault);
						}
					});
				}
			});
		};

		var localLangRequest = getLanguage(navigator.languages[i]).then(function(lang){
			textLocalized = lang;
		});
		startupCalls.push(localLangRequest);
	}

})();


