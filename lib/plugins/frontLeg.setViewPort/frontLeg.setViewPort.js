// ---[[[ frontLeg.setViewPort
var thisPlugin = {
	id: 'frontLeg.setViewPort',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.setViewPort = setViewPort;
		next();
	}
};
module.exports = thisPlugin;



function setViewPort(options) {
	this.options = options;
	var leg = {
		id: 'setViewPort',
		executor: function(next, thisEscalator) {
			console.log('---setViewPort');
			next();
		}
	};
	return leg;
};

