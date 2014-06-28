// ---[[[ head.redisClient
Redis  = require('redis');


var thisPlugin = {
	id: 'backLeg.queueDomains',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.head = {
			redis: Redis.createClient(config.head.db.port, config.head.db.host)
		};
		next();
	}
};

module.exports = thisPlugin;
