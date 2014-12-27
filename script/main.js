/**
 * Created by Lerayne on 21.10.2014.
 */

(function(){

	// on result returned from connection
	var connectionCallback = function(result, actions){

		if (!!result.feeds){

			_(result.feeds).each(function(subscriber){

				for (var key in subscriber) {
					$(window).trigger(key+'-update', [subscriber[key]])
				}
			})
		}
	};


	// main app launcher
	var launchTinng = function(){

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
	};


	// initialization part 1: Basic DOM loaded
	$(function(){
		console.info('Root DOM ready');

		// If this is not IE or its IE 10 - launch the webapp (IE11 and greater aren't having "MSIE" in userAgent)
		if (navigator.userAgent.indexOf('MSIE') == -1 || navigator.userAgent.indexOf('MSIE 10') != -1) {

			launchTinng();

		} else {
			// get outdated-browser warning
			$.get('includes/outdated.html').then(function(html){
				$('body').append(html);
			});
		}
	});


	// initialization part 2: Polymer finished it's startup
	$(window).on('polymer-ready', function(){
		console.info('Polymer ready');

		tinng.connection.start();
	});

})();
