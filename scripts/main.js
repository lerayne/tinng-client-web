/**
 * Created by Lerayne on 21.10.2014.
 */
tinng = {
	units:[]
}





$(function(){

	if (navigator.userAgent.indexOf('MSIE') == -1 || navigator.userAgent.indexOf('MSIE 10') != -1) {

		// in Polymer you now can create new actibe elements as easy as this:
		$('body').append($('<page-main>'));

	} else {

		// get outdated-browser warning
		$.get('includes/outdated.html').then(function(html){
			$('body').append(html);
		});

	}
})