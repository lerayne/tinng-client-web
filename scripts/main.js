/**
 * Created by Lerayne on 21.10.2014.
 */
tinng = {
	units:[]
}





$(function(){

	//функцию плагина разместите внутри коллбэка о готовности DOM
	/*outdatedBrowser({
		bgColor: '#f25648',
		color: '#ffffff',
		lowerThan: 'IE10',
		languagePath: 'bower_components/outdated-browser/outdatedbrowser/lang/ru.html'
	});*/

	if (navigator.userAgent.indexOf('MSIE') == -1 || navigator.userAgent.indexOf('MSIE 10') != -1) {

		// in Polymer you now can create new actibe elements as easy as this:
		$('#app-frame').append($('<page-main>'));

	} else {

		$.get('includes/outdated.html').then(function(html){
			$('#app-frame').append(html);
		})

	}
})