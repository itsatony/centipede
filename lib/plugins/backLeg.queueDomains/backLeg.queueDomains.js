// ---[[[ backLeg.queueDomains
var thisPlugin = {
	id: 'backLeg.queueDomains',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.queueDomains = queueDomains;
		next();
	}
};


function queueDomains(options) {
	this.options = options;
	var leg = {
		id: 'queueDomains',
		executor: function(next, thisEscalator) {
			console.log('---queueDomains');
			next();
		}
	};
	return leg;
};


module.exports = thisPlugin;