// ---[[[ backLeg.queueLinks
var thisPlugin = {
	id: 'backLeg.queueLinks',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.queueLinks = queueLinks;
		next();
	}
};
module.exports = thisPlugin;



function queueLinks(options) {
	this.options = options;
	var leg = {
		id: 'queueLinks',
		executor: function(next, thisEscalator) {
			console.log('---queueLinks');
			next();
		}
	};
	return leg;
};

