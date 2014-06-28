// ---[[[ head.queue
Redis  = require('redis');

var thisPlugin = {
	id: 'backLeg.queueDomains',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.head.queue = new CenipedeQueue(config.job.queue);		
		centipede.head.queue.queueDomains = queueDomains;
		next();
	}
};


CenipedeQueue = function(queueConfig) {
	this.config = config;
	this.init();
};


CenipedeQueue.prototype.init = function() {
	this.connectRedis();
	this.clearQueue();
	this.fillQueueFromSource();	
	return true;
};


CenipedeQueue.prototype.connectRedis = function() {
	this.redis = Redis.createClient(this.config.db.port, this.config.db.host, options);
	return this;
};


CenipedeQueue.prototype.fillQueueFromSource = function() {
	this.redis.sdiffstore(this.config.db.queueSetKey, this.config.db.queueSourceKey, 'undefined');
	return this;
};


CenipedeQueue.prototype.clearQueue = function() {
	this.redis.del(this.config.db.queueSetKey, this.config.db.queueSourceKey, 'undefined');
	return this;
};


CenipedeQueue.prototype.next = function(callback) {
	this.redis.spop(
		this.config.db.queueSetKey,
		function (err, reply) {
			console.log('----getNextDomain');
      console.log(err); 
      console.log(reply);
			log('item: ' + this.config.db.queueSetKey + ' = ' + reply, 'yellow', 'queue.next', 2);
			callback(reply);
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
		log('item: ' + this.config.db.queueSetKey + ' = ' + queueValue, 'yellow', 'queue.add', 2);
	}
	return added;
};
