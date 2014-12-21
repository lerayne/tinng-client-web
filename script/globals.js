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
		strategic:{}
	}
}
