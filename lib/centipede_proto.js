// ---[[[ requires
var Escalator   = require('escalator');
var exec = require('child_process').exec;
 
// ---[[[ Centipede proto
var Centipede = function() {
	var thisCentipede = this;
	this.plugins = {
	};
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
		{ bubble: true, persist: true },
		'centipede'
	);
	if (typeof next === 'function'){
		next();
	}
};

Centipede.prototype.runPhantom = function(parameters, callback) {
	var commandLine = config.phantom.executable + ' ' + parameters.join(' ');
	console.log(commandLine);
	var child = exec(commandLine);
	return exec(
		commandLine,
		{
			timeout: config.phantom.timeout
		},
		function (error, stdout, stderr) {
			log.add('exec [' + commandLine + '] done.', 'yellow', 'runPhantom', 2);
			if (typeof callback === 'function') {
				callback(error, stdout, stderr);
			}
		}
	);
};

module.exports = Centipede;