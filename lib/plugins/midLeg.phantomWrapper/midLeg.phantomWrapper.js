/*  the settings file should be a JSON .. example:
"options" = {
	"crawlId" : "0dae3b9e45d5869fea9ee25feafb1505d1caa5a5_1404579899692_1no5",
	"resultsFilePath" : "/home/itsatony/code/centipede/crawls/results/pageCrawl_0dae3b9e45d5869fea9ee25feafb1505d1caa5a5_1404579899692_1no5.js",
	"page" : {
		"href" : "http://sistrix.de",
		"loadTimeout" : 30000,
		"settings" : {
			"userAgent" : "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36"
		},
		"viewportSize" : {
			"width" : 1920,
			"height" : 1080
		}
	},
	"inPageScripts" : {},
	"phantomModules" : {
		"makeSnapShot" : {
			"file" : "/home/itsatony/code/centipede/lib/plugins/midLeg.makeSnapshot/phantomModule.makeSnapShot.js"
		}
	},
	"makeSnapShot" : {
		"format" : "jpeg",
		"quality" : 80,
		"targetFile" : "/home/itsatony/code/centipede/crawls/snapshots/0dae3b9e45d5869fea9ee25feafb1505d1caa5a5_1404579899692_1no5.jpeg"
	}
};
*/


var system = require('system');
var fs = require('fs');
var WebPage = require('webpage');
var page = WebPage.create();
// config file === first argument of command line
page.results = {};
// --[[ settings
var options = require(system.args[1]).create();

if (typeof options.page.loadTimeout !== 'number') {
	options.page.loadTimeout = 60000;
}

page.viewportSize = {
	widht: 1920,
	height: 1080
};
if (typeof options.page.viewportSize === 'object') {
	page.viewportSize = options.page.viewportSize;
}
page.settings = options.page.settings;
page.settings.loadImages = true;
page.settings.javascriptEnabled  = true;
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

page.onInitialized = function() {
};

page.onConsoleMessage = function (msg, line, source) {
	console.log('console> ' + msg);
};

page.onAlert = function (msg) {
	console.log('alert!!> ' + msg);
};

page.onCallback = function(data) {
	runPhantomScripts();
};

page.open(
	options.page.href,
	function(status) {
		clearTimeout(globalTimeout);
		page.results.status = status;
		if (status === 'success') {
			page.results.injectPhantomQuery = page.injectJs(
				'phantomQuery.js'
			);
			page.evaluate(
				function() {
					var data = {};
					// data.bodyClass = window.phantomQuery('#outerheaven').attr('id');
					window.callPhantom(data);
				}
			);
		} else {
			finish();
		}
	}
);

function runPhantomScripts(status) {
	var pS = {};
	for (var s in options.inPageScripts) {
		if (page.injectJs(options.inPageScripts[s].file) === true) {
			page.results[s] = window[options.inPageScripts[s].call].apply(this, [ page, window, document, options ]);
		}
	}
  for (var s in options.phantomModules) {
		pS[s] = require(options.phantomModules[s].file)[s]();
		pS[s].apply(this, [ page, window, document, options ]);
	}
	finish();
};

function finish() {
	jsonResults = JSON.stringify(page.results);
	fs.write(options.resultsFilePath, ';module.exports = ' + jsonResults + ';', 'w');
	console.log(';;;;' + jsonResults + ';;;;;;;');
	delete page;
	setTimeout(
		function() {
			phantom.exit();
		},
		250
	);
};

var globalTimeout = setTimeout(
	function(){
		console.log(';;;;{ "status": "fail", "error": "timeout" };;;;;;;');	
		phantom.exit();
	}, 
	options.page.loadTimeout
);


