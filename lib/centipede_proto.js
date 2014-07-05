// ---[[[ requires
var Escalator   = require('escalator');
var exec = require('child_process').exec;
var url = require('url');
var crypto = require('crypto');

 
// ---[[[ Centipede proto
var Centipede = function() {
	var thisCentipede = this;
	this.plugins = {};
	this.legs = {};
	this.head = {};
};
 
Centipede.prototype.init = function(cfg, callback) {
	var thisCentipede = this;
		// ------------------------- [[[ plugins
	for (var n=0; n<cfg.plugins.length; n++) {
		thisCentipede.loadPlugin(cfg.plugins[n]);
	}
	// ------------------------- [[[ init plugins
	var init = new Escalator('centi_init', [], cfg.debug.escalator);
	for (var pluginName in thisCentipede.plugins) { 
		init.add(thisCentipede.plugins[pluginName]);
	};
	init.onFinish = function() {
		bubPubSub.publish('/centipede/start/done', { }, {}, 'centipede.start');
		if (typeof callback === 'function') {
			callback(thisCentipede);
		}
	}
	return init.start();
};

Centipede.prototype.loadPlugin = function(pluginName) {
	var defaultPath = process.cwd() + '/lib/plugins/';
	var lastSlash = pluginName.lastIndexOf('/');
	var pureModuleName = (lastSlash === -1) ? pluginName : pluginName.substr(lastSlash+1);
	var jsEndingIndex = pluginName.lastIndexOf('.js');
	pureModuleName = (jsEndingIndex === -1) ? pureModuleName : pureModuleName.substr(0, pureModuleName.lastIndexOf('.js') -1 );
	var uri = (lastSlash === -1) ? defaultPath + pluginName : pluginName;
	log.add('loading ' + uri, 'cyan', 'PLUGINS', 3);
	this.plugins[pureModuleName] = require(uri);
	bubPubSub.publish('/centipede/plugins/loaded', { moduleName: pureModuleName }, {}, 'centipede.plugins.init');
	return this.plugins[pureModuleName];
};


Centipede.prototype.runPhantom = function(parameters, callback) {
	var executionId = minions.randomString(8, true, true, true);
	var commandLine = config.phantom.executable + ' ' + parameters.join(' ');
	log.add('running phantomJS task [' + executionId + '] : ' + commandLine, 'yellow', 'runPhantom', 1);
	var child = exec(commandLine);
	return exec(
		commandLine,
		{
			timeout: config.phantom.timeout
		},
		function (error, stdout, stderr) {
			log.add('phantomJS task [' + executionId + '] done.', 'yellow', 'runPhantom', 1);
			if (typeof callback === 'function') {
				callback(error, stdout, stderr);
			}
		}
	);
};


Centipede.prototype.crawlJob = function() {
	var thisCentipede = this;
	// add a loop here to run multiple parallel crawls
	this.head.queue.next(
		function(qErr, qReply) {
			thisCentipede.crawlPage(qErr, qReply);
		}
	);
};


Centipede.prototype.crawlPage = function(qErr, qReply) {
	var thisCentipede = this;
	var nextPageCrawl = new centipede.PageCrawl(
		config.job.legs, 
		qReply, 
		function(errors, results) {
			console.log('+++DONE WITH CRAWL: +++');
			console.log(errors);
			console.log(results);
			console.log();
			console.log();
			thisCentipede.crawlJob();
		}
	);
};

Centipede.prototype.checksum = function(content, algorithm, encoding) {
	if (typeof content !== 'string' && (typeof content !== 'object' || !content instanceof Buffer)) {
		log.add('BAD INPUT FOR checksum! : ' + typeof content + '===' + content, 'red', 'checksum', 3);
		return false;
	}
	var checksum = crypto
		.createHash(algorithm || 'sha1')
		.update(content, 'utf8')
		.digest(encoding || 'hex');
	return checksum;
};

Centipede.prototype.shortenProtocol = function(href) {
	var shortened = href.replace(/^http\:\/\//, '//');
	shortened = shortened.replace(/^https\:\/\//, 's//');
	return shortened;
};


Centipede.prototype.invertHostname = function(href) {
	// create <tld>:<domain>:<subdomain>
	var parsed = url.parse(href);
	var parts = parsed.host.split('.');
	var invertedHostname = '';
	for (var n = parts.length-1; n > -1; n-=1) {
		invertedHostname += parts[n]
		if (n !== 0) {
			invertedHostname += ':';
		}
	}
	return invertedHostname;
};


module.exports = Centipede;