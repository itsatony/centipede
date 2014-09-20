// ---[[[ midLeg.usedSoftware
var thisPlugin = {
	id: 'midLeg.usedSoftware',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.usedSoftware = usedSoftware;
		next();
	}
};
module.exports = thisPlugin;



function usedSoftware(options) {
	this.options = options;
	var leg = {
		id: 'usedSoftware',
		executor: function(next, thisEscalator) {
			console.log('---usedSoftware');
			var targetFile = config.directories.snapshots + '/' + thisEscalator.phantomOptions.crawlId + '.' + options.format;
			thisEscalator.phantomOptions.phantomModules.postPageLoad.usedSoftware = {
				file: __dirname + '/phantomModule.usedSoftware.js'
			};
			thisEscalator.phantomOptions.usedSoftware = {
				
			};
			next();
		}
	};
	return leg;
};

