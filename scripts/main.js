/**
 * Created by Lerayne on 21.10.2014.
 */
tinng = {
	units:[]
}


if (navigator.userAgent.indexOf('MSIE 8') != -1 || navigator.userAgent.indexOf('MSIE 9') != -1) {
	location.href = 'http://outdatedbrowser.com/ru';
}


$(function(){

	//функцию плагина разместите внутри коллбэка о готовности DOM
	/*outdatedBrowser({
		bgColor: '#f25648',
		color: '#ffffff',
		lowerThan: 'IE10',
		languagePath: 'bower_components/outdated-browser/outdatedbrowser/lang/ru.html'
	});*/

	// in Polymer you now can create new actibe elements as easy as this:
	$('#app-frame').append($('<page-main>'));

})