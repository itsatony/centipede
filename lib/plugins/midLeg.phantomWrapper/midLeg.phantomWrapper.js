/*  the settings file should be a JSON
"options" = {
	resultsFilePath: "~/code/centipede/pageCrawl_" + redisKey + ".js",
	"page": {
		"href": "https://google.de",
		"viewportSize": {
			"width": 1920,
			"height": 1080
		},
		"loadTimeout": 30000
	},
	"scripts": {
		"getLinks": {
			"file": "/midLeg.getLinks/midLeg.getLinks.js",
			"call": "getLinks"
		}
	}
};
*/


var system = require('system');
var fs = require('fs');
var WebPage = require('webpage');
var page = WebPage.create();
// config file === first argument of command line
var results = {};
// --[[ settings
var options = require(system.args[1]);
if (typeof settings.page.loadTimeout !== 'number') {
	settings.page.loadTimeout = 60000;
}

page.viewportSize = {
	widht: 1920,
	height: 1080
};
if (typeof options.page.viewportSize === 'object') {
	page.viewportSize = options.page.viewportSize;
}
page.settings = options.page.settings;

page.options = options;

page.onError = function(msg, trace) {
	console.log('--[[ ERROR ------------------------------------------');
	console.log(msg);
	trace.forEach(
		function(item) {
			console.log('  ' +  item.file +  ':' + item.line);
		}
	);
};


page.open(
	href,
	function(status) {
		var pS = {};
		results.status = status;
		clearTimeout(globalTimeout);
		for (var s in options.inPageScripts) {
			if (page.injectJs(options.inPageScripts[s].file) === true) {
				results[s] = window[options.inPageScripts[s].call].apply(this, [ page, window, document, options ]);
			}
		}
		for (var s in options.phantomScripts) {
			pS[s] = require(options.phantomScripts[s].file);
			pS[s].apply(this, [ page, window, document, options ]);
		}
		jsonResults = JSON.stringify(results);
		fs.write(options.resultsFilePath, jsonResults, 'w');
		console.log(';;;;' + jsonResults + ';;;;;;;');
		delete page;
		setTimeout(
			function() {
				phantom.exit();
			},
			1000
		);
	}
);


var globalTimeout = setTimeout(
	function(){
		console.log(';;;;{ "status": "fail", "file": "", "title": "timeout" };;;;;;;');	
		phantom.exit();
	}, 
	options.page.loadTimeout
);