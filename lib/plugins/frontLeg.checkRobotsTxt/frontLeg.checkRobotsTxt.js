// ---[[[ frontLeg.checkRobotsTxt
var thisPlugin = {
	id: 'frontLeg.checkRobotsTxt',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.checkRobotsTxt = checkRobotsTxt;
		next();
	}
};
module.exports = thisPlugin;



function checkRobotsTxt(options) {
	this.options = options;
	var leg = {
		id: 'checkRobotsTxt',
		executor: function(next, thisEscalator) {
			console.log('---checkRobotsTxt');
			next();
		}
	};
	return leg;
};

