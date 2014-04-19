// ---[[[ requires
var Escalator   = require('escalator');
 
// ---[[[ Centipede proto
var Centipede = function() {
	var thisCentipede = this;
	this.plugins = {
	};
};
 
Centipede.prototype.init = function(cfg) {
	var thisCentipede = this;
		// ------------------------- [[[ plugins
	for (var n=0; n<cfg.plugins.length; n++) {
		var pluginName = cfg.plugins[n];
		var defaultPath = process.cwd() + '/lib/plugins/';
		var lastSlash = pluginName.lastIndexOf('/');
		var pureModuleName = (lastSlash === -1) ? pluginName : pluginName.substr(lastSlash+1);
		var jsEndingIndex = pluginName.lastIndexOf('.js');
		pureModuleName = (jsEndingIndex === -1) ? pureModuleName : pureModuleName.substr(0, pureModuleName.lastIndexOf('.js') -1 );
		var uri = (lastSlash === -1) ? defaultPath + pluginName : pluginName;
		log.add('loading ' + uri, 'cyan', 'PLUGINS', 3);
		thisCentipede.plugins[pureModuleName] = require(uri);
		bubPubSub.publish('/centipede/plugins/loaded', { moduleName: pureModuleName }, {}, 'centipede.plugins.init');
	}
	// ------------------------- [[[ init plugins
	var init = new Escalator('centi_init', [], cfg.debug);
	for (var pluginName in thisCentipede.plugins) { 
		init.add(thisCentipede.plugins[pluginName]); 
	};
	init.add({ id:'initModuleSignal', executor: thisCentipede.sendModuleInitSignal });
	init.onFinish = function() {
		if (typeof callback === 'function') {
			callback(thisCentipede);
		}
		bubPubSub.publish('/centipede/start/done', { }, {}, 'centipede.start');
	}
	return init.start();
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

module.exports = Centipede;