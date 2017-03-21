/**
 * Created by Lerayne on 21.10.2014.
 */

(function(){

	// main app launcher
	var onDOMReady = function(){

		// routing
		tinng.router = new tinng.class.Router();

		// connection
		tinng.connection = new tinng.class.Connection({
			server: tinng.cfg.server_url,
			autostart: false
		});


		// window activity behaviors
		tinng.state.windowFocused = document.hasFocus();

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


		// when all pre-startup async calls resolved
		Promise.all(tinng.service.startupAsyncsQueue).then(function(){
			console.info('STAGE: pre-startup async calls queue resolved');

			// in Polymer you now can create new active elements as easy as this:
			if (screen.width < 800) {
				console.info('Device is mobile');
				$('body').append($('<page-main-mobile>'));
			} else {
				console.info('Device is desktop');
				$('body').append($('<page-main class="tinng-page">'));
			}
		})
	};



	// after polymer inited
	var onPolymerReady = function(){

		tinng.connection.start();
	};




	// initialization part 1: Basic DOM loaded
	$(function(){
		console.info('STAGE: Root DOM ready');

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
	$(window).on('WebComponentsReady', function(){
		console.info('STAGE: Polymer ready');

		onPolymerReady();
	});

})();
