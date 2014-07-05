// ---[[[ requires
var Escalator   = require('escalator');
var exec = require('child_process').exec;
var url = require('url');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');

 
// ---[[[ Centipede proto
var Centipede = function() {
	var thisCentipede = this;
	this.plugins = {};
	this.legs = {};
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
	init.add({ id:'initModuleSignal', executor: thisCentipede.sendModuleInitSignal });
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

Centipede.prototype.sendModuleInitSignal = function(next) {
	var thisCentipede = this;
	bubPubSub.publish(
		'/centipede/init/modules',
		{
			parent: thisCentipede
		},
		{ persist: true },
		'centipede'
	);
	if (typeof next === 'function'){
		next();
	}
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




Centipede.prototype.sha1 = function(content) {
	return shasum.update(content);
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