/**
 * Created by Lerayne on 21.10.2014.
 */

(function(){

	// main app launcher
	var onDOMReady = function(){

		tinng.state.windowFocused = document.hasFocus();

		tinng.connection = new tinng.class.Connection({
			server: tinng.cfg.server_url,
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

		// in Polymer you now can create new active elements as easy as this:
		$('body').append($('<page-main>'));
	};



	// after polymer inited
	var onPolymerReady = function(){

		tinng.connection.start();
	};




	// initialization part 1: Basic DOM loaded
	$(function(){
		console.info('Root DOM ready');

		// If this is not IE or its IE 10 - launch the webapp (IE11 and greater aren't having "MSIE" in userAgent)
		if (navigator.userAgent.indexOf('MSIE') == -1 || navigator.userAgent.indexOf('MSIE 10') != -1) {

			onDOMReady();

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

		onPolymerReady();
	});

})();
