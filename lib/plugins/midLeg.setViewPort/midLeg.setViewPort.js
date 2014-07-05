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
	var defaultViewportSize = {
		'width': 1920,
		'height': 1080
	};
	var leg = {
		id: 'setViewPort',
		executor: function(next, thisEscalator) {
			console.log('---setViewPort');
			thisEscalator.phantomOptions.page.viewportSize = 
				(typeof options.viewportSize === 'object') 
			? 
				options.viewportSize
			: 
				defaultViewportSize
			;
			next();
		}
	};
	return leg;
};

