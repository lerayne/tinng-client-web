/**
 * Created by Lerayne on 21.10.2014.
 */

var connectionCallback = function(result, actions){

	if (!!result.feeds){

		if (result.feeds instanceof Array) {
			$(result.feeds).each(function(i, subscriber){
				console.log(i, subscriber)

				for (var key in subscriber) {
					$(window).trigger(key+'-update', [subscriber[key]])
				}
			})
		} else {
			for (var i in result.feeds) {
				var subscriber = result.feeds[i];

				for (var key in subscriber) {
					$(window).trigger(key+'-update', [subscriber[key]])
				}
			}
		}


	}
}

// initialization part 1: Basic DOM loaded
$(function(){

	// If this is not IE or its IE 10 - launch the webapp (IE11 and greater aren't having "MSIE" in userAgent)
	if (navigator.userAgent.indexOf('MSIE') == -1 || navigator.userAgent.indexOf('MSIE 10') != -1) {

		tinng.state.windowFocused = document.hasFocus();

		tinng.connection = new tinng.class.Connection({
			server: tinng.cfg.server_url,
			callback:connectionCallback,
			autostart: false
		});

		// поведение при активации и деактивации окна
		$(window).on('blur', function(){

			if (tinng.state.windowFocused) {
				tinng.state.windowFocused = false;
				tinng.connection.setMode('passive');
			}
		});

		$(window).on('focus', function(){

			if (!tinng.state.windowFocused) {
				tinng.state.windowFocused = true;
				tinng.connection.setMode('active');
			}
		});

		// in Polymer you now can create new actibe elements as easy as this:
		$('body').append($('<page-main>'));

	} else {

		// get outdated-browser warning
		$.get('includes/outdated.html').then(function(html){
			$('body').append(html);
		});

	}
})

// initialization part 2: Polymer finished it's work
$(window).on('polymer-ready', function(){
	console.log('Polymer is ready')

	tinng.connection.start();
})
