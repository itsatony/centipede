// ---[[[ frontLeg.setSSL
var thisPlugin = {
	id: 'frontLeg.setSSL',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.setSSL = setSSL;
		next();
	}
};
module.exports = thisPlugin;



function setSSL(options) {
	this.options = options;
	var leg = {
		id: 'setSSL',
		executor: function(next, thisEscalator) {
			console.log('---setSSL');
			thisEscalator.phantomParameters.push('--ignore-ssl-errors=true');
			next();
		}
	};
	return leg;
};

