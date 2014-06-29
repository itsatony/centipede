// ---[[[ midLeg.grabLinks
var thisPlugin = {
	id: 'midLeg.grabLinks',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.grabLinks = grabLinks;
		next();
	}
};
module.exports = thisPlugin;



function grabLinks(options) {
	this.options = options;
	var leg = {
		id: 'grabLinks',
		executor: function(next, thisEscalator) {
			console.log('---grabLinks');
			next();
		}
	};
	return leg;
};

