// ---[[[ frontLeg.setUserAgent
var thisPlugin = {
	id: 'frontLeg.setUserAgent',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.setUserAgent = setUserAgent;
		next();
	}
};
module.exports = thisPlugin;



function setUserAgent(options) {
	this.options = options;
	var leg = {
		id: 'setUserAgent',
		executor: function(next, thisEscalator) {
			console.log('---setUserAgent');
			next();
		}
	};
	return leg;
};

