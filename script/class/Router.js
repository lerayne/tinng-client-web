/**
 * Created by M. Yegorov on 2015-01-23.
 */

tinng.class.Router = function(){
	tinng.funcs.bind(this);
	var that = this;

	this.params = {};

	if (location.hash) {
		var pairs = location.hash.replace('#', '').split('&');

		_(pairs).each(function(pair){
			var keyval = pair.split('=');
			that.params[keyval[0]] = keyval[1] || true;
		});
	}
};

tinng.class.Router.prototype = {
	$push:function(){
		var pairs = [];

		_(this.params).each(function(val, key){
			pairs.push(key + '=' + val);
		});

		location.hash = pairs.join('&');
	},

	// todo - make this func also accept a key-value object pairs
	note:function(key, val){

		if (val === '' || val === null || typeof val == 'undefined'){
			delete this.params[key];
		} else {
			this.params[key] = val;
		}
		this.$push();
	},

	// to avoid undefined check
	get:function(key){
		if (this.params[key]){
			return this.params[key];
		} else {
			return false;
		}
	}
};
