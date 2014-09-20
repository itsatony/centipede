// https://raw.githubusercontent.com/ElbertF/Wappalyzer/master/share/apps.json   // needs editing!
// https://raw.githubusercontent.com/ElbertF/Wappalyzer/master/share/js/wappalyzer.js
var   system = require('system');
var       fs = require('fs');

var usedSoftware = function(_page, _window, _document, _options) {
	var cleanContent = page.content; //fixNoScript(page.content);
	var pageContent = cleanContent.replace(/\s*/, ' ');
	var results = {};
	console.log('-- identify used Software');
	
  console.log('wappalyzer: ', page.injectJs('../midLeg.usedSoftware/wappalyzer.js'));
  console.log('apps: ', page.injectJs('../midLeg.usedSoftware/apps.js'));
  console.log('driver: ', page.injectJs('../midLeg.usedSoftware/driver.js'));
	var headers = {};
	results = page.evaluate(detectApps, _document.location.href, headers, pageContent);
	page.results.usedSoftware = {
		success: results
	};
	page.whatIsDone.usedSoftware = true;
};



exports.usedSoftware = function () {
	return usedSoftware;
};


function detectApps(url, headers, pageContent) {
	// well? is this better than the pased in stuff ?
	// pageContent = document.getElementsByTagName('html')[0].innerHTML;
	
	// the env property of wappalyzer is elusive because with phantomjs we
	// don't yet have the ability to get the source of all of the scripts
	// that are loaded without doing the work of going out separately to get them.
	// we can do that later but in the mean time we are going to pass in the source for all
	// of the script elements.
	var env = [];
	for (var env_var in window) { 
		if ( window.hasOwnProperty(env_var)) {
			env.push(env_var);
		} 
	}
	//console.log('ENV VARS=' + env);
	wappalyzer.analyze(url, url, {
		html: pageContent,
		headers: headers,
		env: env
	});
	//console.log('HTML=' + document.getElementsByTagName('html')[0].innerHTML);
	console.log('info: ' + url + '] finished with eval on wappalyzer');
	var apps = [];
	for (var app in wappalyzer.detected[url]) {
		var appName = wappalyzer.detected[url][app].app;
		var appString = appName;
		var version = ( 
			typeof wappalyzer.detected[url][app].version === 'string' 
			&& wappalyzer.detected[url][app].version !== ''
		)	? 
				wappalyzer.detected[url][app].version
			:
				'0.0'
		;
		appString += ';' + version;
		for (var i=0; i<wappalyzer.apps[appName].cats.length; i+=1) {
			var categoryIndex = wappalyzer.apps[appName].cats[i];
			var categoryName = wappalyzer.categories[categoryIndex];
			appString += ';' + categoryName;
		}
		apps.push(appString);
	}
	// wappalyzer.detected[url].map(function(app) {
		// if ( wappalyzer.apps[app] ) {
			// // var cats = wappalyer.apps[app].cats;
			// apps.push(app);
		// }
	// });
	return apps.join('|');        
};
