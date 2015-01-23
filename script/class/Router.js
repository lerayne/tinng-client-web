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

	note:function(key, val){

		this.params[key] = val;
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
