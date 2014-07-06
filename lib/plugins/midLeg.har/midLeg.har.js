// ---[[[ midLeg.har
var thisPlugin = {
	id: 'midLeg.har',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.legs.har = har;
		next();
	}
};
module.exports = thisPlugin;



function har(options) {
	this.options = options;
	var leg = {
		id: 'har',
		executor: function(next, thisEscalator) {
			console.log('---har');
			// var targetFile = config.directories.snapshots + '/' + thisEscalator.phantomOptions.crawlId + '.' + options.format;			
			thisEscalator.phantomOptions.phantomModules.prePageOpen.har = {
				file: __dirname + '/phantomModule.har.js'
			};
			thisEscalator.phantomOptions.har = {
				nothing: true
			};
			next();
		}
	};
	return leg;
};

