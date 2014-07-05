function options() {
	return {
		"crawlId" : "0dae3b9e45d5869fea9ee25feafb1505d1caa5a5_1404579899692_exmpl",
		"resultsFilePath" : "/home/itsatony/code/centipede/crawls/results/example_phantomjs_result.js",
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
		"phantomScripts" : {
			"makeSnapShot" : {
				"file" : "/home/itsatony/code/centipede/lib/plugins/midLeg.makeSnapshot/phantomScript.makeSnapShot.js"
			}
		},
		"makeSnapShot" : {
			"format" : "jpeg",
			"quality" : 80,
			"targetFile" : "/home/itsatony/code/centipede/crawls/snapshots/0dae3b9e45d5869fea9ee25feafb1505d1caa5a5_1404579899692_exmpl.jpeg"
		}
	};
};
exports.create = function () {
	return options();
};
