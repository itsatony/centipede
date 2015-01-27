
// ---[[[ head.pageCrawl
var Redis = require('redis');
var	Escalator = require('escalator');
var fs = require('fs');

var thisPlugin = {
	id: 'head.pageCrawl',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.PageCrawl = PageCrawl;
		next();
	}
};
module.exports = thisPlugin;


// new centipede.PageCrawl(config.job.legs, href, function(errors, results) {]);
PageCrawl = function(legs, href, callWhenDone) {
	var thisPageCrawl = this;
	this.id = centipede.checksum(href) + '_' + Date.now() + '_' + minions.randomString(4, true, true);
	this.crawlDir = config.directories.crawls.replace('{{crawlDir}}', this.id, 'g');;
	this.createDirectoryIfNeeded(this.crawlDir);
	this.href = href;
	this.legs = legs;
	this.data = {};
	this.error = null;
	this.resultsDir = config.directories.crawls.replace('{{crawlDir}}', this.id, 'g');
	this.resultsFilePath = this.resultsDir + '/results_' + this.id + '.js';
	this.callWhenDone = callWhenDone;
	this.pageCrawlEscalator = new Escalator('pageCrawl_' + href, [], true);
	this.pageCrawlEscalator.onFinish = function() { 
		log.add('done with : ' + thisPageCrawl.href, 'green', 'PageCrawl', 2);
		thisPageCrawl.callWhenDone(thisPageCrawl.error, thisPageCrawl.data);
	};
	this.pageCrawlEscalator.phantomOptions = {
		'crawlId': this.id,
		'resultsFilePath': this.resultsFilePath,
		'page': {
			'href': this.href,
			'loadTimeout': 30000,
			'settings': {}
		},
		'inPageScripts': {
		},
		'phantomModules': {
			'prePageOpen': {},
			'postPageLoad': {}
		}
	};
	this.pageCrawlEscalator.phantomParameters = [
		'--config=' + process.cwd() + '/crawls/phantomConfig.json',
		config.directories.plugins + '/midLeg.phantomWrapper/midLeg.phantomWrapper.js'
	];
	this.pageCrawlEscalator.phantomResults = {};
	this.init();
};

PageCrawl.prototype.init = function() {
	var leg, legConfig;
	// front legs are meant to setup stuff 
	// and control phantom parameters
	for (var f = 0; f < this.legs.front.length; f+=1) {
		leg = centipede.legs[this.legs.front[f].id](this.legs.front[f].options);
		this.pageCrawlEscalator.add(leg);
	}
	// then mid-legs should handle the page content
	for (var f = 0; f < this.legs.mid.length; f+=1) {
		leg = centipede.legs[this.legs.mid[f].id](this.legs.mid[f].options);
		this.pageCrawlEscalator.add(leg);
	}
	// then we send phantom to the href
	this.pageCrawlEscalator.add(this.chainSurf());
	// backLegs are there to do something with the data
	// extracted from the page
	for (var f = 0; f < this.legs.back.length; f+=1) {
		leg = centipede.legs[this.legs.back[f].id](this.legs.back[f].options);
		this.pageCrawlEscalator.add(leg);
	}
	this.pageCrawlEscalator.start();
};


PageCrawl.prototype.chainSurf = function() {
	var thisPageCrawl = this;	
	this.settingsDir = config.directories.crawls.replace('{{crawlDir}}', this.id, 'g');
	var leg = {
		id: 'surf',
		executor: function(next, thisEscalator) {
			console.log('---surf');			
			var settingsFilePath = thisPageCrawl.settingsDir + '/settings_' + thisPageCrawl.id + '.js';
			fs.writeFileSync(
				settingsFilePath, 
				'function options() {	return ' 
					+ JSON.stringify(thisEscalator.phantomOptions) 
					+ ';};exports.create = function() { return options();};', 
				'utf8'
			);
			thisEscalator.phantomParameters.push(settingsFilePath);
			centipede.runPhantom(
				thisEscalator.phantomParameters,
				function(err, consolelog, something) {
					thisPageCrawl.phantomAnswer = require(thisPageCrawl.resultsFilePath);
					console.log('***');
					console.log(thisPageCrawl.phantomAnswer);
					console.log('---');
					console.log(consolelog);
					next();
				}
			);
		}
	};
	return leg;
};




PageCrawl.prototype.directoryExists = function(path) {
	var exists = fs.existsSync(path);
	if (exists !== true) {
		return false;
	}
	var stats = fs.lstatSync(path);
	return stats.isDirectory();
};

PageCrawl.prototype.createDirectoryIfNeeded = function(path) {
	var pathExists = this.directoryExists(path);
	if (pathExists === false) {
		log.add('directory [' + path + '] created', 'yellow', 'createDirectoryIfNeeded', 1);
		return fs.mkdirSync(path);
	}
	log.add('directory [' + path + '] already present', 'yellow', 'createDirectoryIfNeeded', 1);
	return true;
};