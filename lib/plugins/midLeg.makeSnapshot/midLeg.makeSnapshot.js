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
			var targetFile = config.directories.snapshots + '/' + thisEscalator.phantomOptions.crawlId + '.' + options.format;			
			thisEscalator.phantomOptions.phantomModules.makeSnapshot = {
				file: __dirname + '/phantomModule.makeSnapshot.js'
			};
			thisEscalator.phantomOptions.makeSnapshot = {
				format: options.format,
				quality: options.quality,
				targetFile: targetFile
			};
			next();
		}
	};
	return leg;
};

