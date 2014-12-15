/**
 * Created by Lerayne on 21.10.2014.
 */
tinng = {
	units:[]
}



$(function(){

	// If this is not IE or its IE 10 - launch the webapp (IE11 and greater aren't having "MSIE" in userAgent)
	if (navigator.userAgent.indexOf('MSIE') == -1 || navigator.userAgent.indexOf('MSIE 10') != -1) {

		// in Polymer you now can create new active elements as easy as this:
		$('#app-frame').append($('<page-main>'));

	} else {

		// get excuse update-your-browser redirect
		$.get('includes/outdated.html').then(function(html){
			$('#app-frame').append(html);
		})

	}
})