// ---[[[ midLeg.makeSnapshot
var thisPlugin = {
	id: 'midLeg.makeSnapshot',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.makeSnapshot = makeSnapshot;
		next();
	}
};
module.exports = thisPlugin;



function makeSnapshot(options) {
	this.options = options;
	var leg = {
		id: 'makeSnapshot',
		executor: function(next, thisEscalator) {
			console.log('---makeSnapshot');
			next();
		}
	};
	return leg;
};

