// ---[[[ head.queue
var Redis  = require('redis');

var thisPlugin = {
	id: 'head.queue',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.head.queue = new CenipedeQueue(config.job.queue, next);		
		// centipede.head.queue.queueDomains = queueDomains;
	}
};

module.exports = thisPlugin;


CenipedeQueue = function(queueConfig, callback) {
	this.config = queueConfig;
	this.options = {};
	this.init(callback);
};


CenipedeQueue.prototype.init = function(callback) {
	var thisQueue = this;
	this.connectRedis();
	this.clearQueue(
		function() {
			thisQueue.fillQueueFromSource(
				function() {
					callback();
				}
			);
		}
	);
	
	return true;
};


CenipedeQueue.prototype.connectRedis = function() {
	var thisQueue = this;
	this.redis = Redis.createClient(
		this.config.db.port, 
		this.config.db.host, 
		this.options
	);
	return this;
};


CenipedeQueue.prototype.fillQueueFromSource = function(callback) {
	var thisQueue = this;
	this.redis.sdiffstore(
		this.config.db.queueSetKey, 
		this.config.db.queueSourceSetKey, 
		'undefined',
		function(err, res) {
			log.add(
				'added ' 
					+ res 
					+ ' HREFs from queueSourceSetKey ' 
					+ thisQueue.config.db.queueSourceSetKey 
					+ ' to queue ' + thisQueue.config.db.queueSetKey, 
				'yellow', 
				'fillQueueFromSource', 
				3
			);
			callback(err, res);
		}
	);
	return this;
};


CenipedeQueue.prototype.clearQueue = function(callback) {
	var thisQueue = this;
	this.redis.del(
		this.config.db.queueSetKey, 
		this.config.db.queueSourceKey, 
		'undefined',
		function(err, res) {
			log.add(
				'cleared queue ' 
					+ thisQueue.config.db.queueSetKey, 
				'yellow', 
				'clearQueue', 
				3
			);
			callback(err, res);
		}
	);
	return this;
};


CenipedeQueue.prototype.next = function(callback) {
	var thisQueue = this;
	this.redis.spop(
		thisQueue.config.db.queueSetKey,
		function (err, reply) {
			if (err !== null) {
				log.add(
					'error during db request for : ' 
						+ thisQueue.config.db.queueSetKey 
						+ ' = ' 
						+ err, 
					'red', 
					'queue.next', 
					3
				);
				process.exit();
			}
			if (reply === null) {
				log.add(
					'no item left in queue : ' 
						+ thisQueue.config.db.queueSetKey 
						+ ' = ' 
						+ reply, 
					'red', 
					'queue.next', 
					3
				);
				// trigger job done event
				return;
			}
			log.add(
				'item: ' 
					+ thisQueue.config.db.queueSetKey 
					+ ' = ' 
					+ reply, 
				'yellow', 
				'queue.next', 
				2
			);
			callback(err, reply);
    }
	);
	return this;
};


CenipedeQueue.prototype.add = function(hrefArray) {	
	var queueValue = '';
	var added = [];
	if (typeof hrefArray === 'string') {
		hrefArray = [ hrefArray ];
	}
	for (var i=0; i < hrefArray.length; i+=1) {
		queueValue = centipede.shortenProtocol(hrefArray);
		added.push(queueValue);
		this.redis.sadd(this.config.db.queueSetKey, queueValue);
		log(
			'item: ' 
				+ this.config.db.queueSetKey 
				+ ' = ' 
				+ queueValue, 
			'yellow', 
			'queue.add', 
			2
		);
	}
	return added;
};
