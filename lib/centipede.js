// ------------------------- [[[ welcome
console.log('--[[ centipede');
// ------------------------- [[[ requires 
var
	Minions 		= require('minions'),
	Log      		= require('lg'),
	Bubpubsub   = require('bubpubsub'),
	Redis       = require('redis'),
	Escalator   = require('escalator');
	Centipede   = require(__dirname + '/centipede_proto')
;
// ------------------------- [[[ load config
try {
	global.config = require(process.argv[2]);
} catch(err) {
	console.error('bad config file. exiting');
	throw(err);
	process.exit();
}
// ------------------------- [[[ minions
global.minions = new Minions(['node']);
// ------------------------- [[[ exception handling
process.on('uncaughtException', minions.exceptionHandler);
// ------------------------- [[[ bubPubSub
global.bubPubSub = new Bubpubsub('centiBPS');
global.bubPubSub.defaults.debugging = (config.debug === true) ? 1 : 0;
// ------------------------- [[[ logging
global.log = new Log(config.lg);
// ------------------------- [[[ REPL
if (typeof config.repl === 'object') {
	var replHost = (typeof config.repl.host === 'string') ? config.repl.host : 'localhost';
	var replHost = (typeof config.repl.port === 'number') ? config.repl.port : 4321;
	minions.openSocktREPL(config.id, config.repl.port, config.repl.host);
}
// ------------------------- [[[ go
global.centipede = new Centipede(config);
bubPubSub.subscribe(
	'/centipede/start/done',
	function() {
		log.add('READY', 'green', 'centipede', 3);
	}
);
centipede.init(config);



