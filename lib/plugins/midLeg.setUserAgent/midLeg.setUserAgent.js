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

var agentStrings = {
	'centipede1': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Centipede/1.0 Safari/537.36',
	'chrome37': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36',
	'Googlebot2.1': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
};

function setUserAgent(options) {
	this.options = options;
	var leg = {
		id: 'setUserAgent',
		executor: function(next, thisEscalator) {
			console.log('---setUserAgent');
			thisEscalator.phantomOptions.page.settings.userAgent = 
				(typeof options.ua === 'string') 
				?
					options.ua
				: 
					agentStrings.chrome37
			;
			next();
		}
	};
	return leg;
};

