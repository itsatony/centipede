// ------------------------- [[[ welcome
console.log('--[[ centipede');
// ------------------------- [[[ requires 
var
	path				= require('path'),
	Minions 		= require('minions'),
	Log      		= require('lg'),
	Bubpubsub   = require('bubpubsub'),
	Escalator   = require('escalator'),
	Centipede   = require(__dirname + '/centipede_proto')
;



module.exports = function() {
	// ------------------------- [[[ load config
	try {
		var pathPrefix = '';
		var configPath = path.join(process.cwd(), process.argv[2]);
		console.log('---[[ loading config file {%s} ', configPath);
		global.config = require(configPath);
	} catch(err) {
		console.error('bad config file {%s} relative to {%s} ! -> exiting!', configPath, process.cwd());
		throw(err);
		process.exit();
	}
	// ------------------------- [[[ minions
	global.minions = new Minions(['node']);
	// ------------------------- [[[ exception handling
	process.on('uncaughtException', minions.exceptionHandler);
	// ------------------------- [[[ bubPubSub
	global.bubPubSub = new Bubpubsub('centiBPS');
	global.bubPubSub.defaults.debugging = (config.debug.bubPubSub === true) ? 1 : 0;
	// ------------------------- [[[ logging
	global.log = new Log(config.lg);
	// ------------------------- [[[ REPL
	if (typeof config.repl === 'object') {
		var replHost = (typeof config.repl.host === 'string') ? config.repl.host : 'localhost';
		var replPort = (typeof config.repl.port === 'number') ? config.repl.port : 4321;
		minions.openSocktREPL(config.id, replPort, replHost);
	}
	// ------------------------- [[[ go
	global.centipede = new Centipede(config);
	bubPubSub.subscribe(
		'/centipede/start/done',
		function() {
			log.add('READY', 'green', 'centipede', 3);
			centipede.crawlJob();
		}
	);
	centipede.init(config);
};
