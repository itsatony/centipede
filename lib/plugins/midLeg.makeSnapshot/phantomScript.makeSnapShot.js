;

var makeSnapShot = (
	function() {
		return function(_page, _window, _document, _options) {
			page.render(
				page.options.makeSnapShot.targetFile, 
				{
					format: page.options.makeSnapShot.format, 
					quality: page.options.makeSnapShot.quality
				}
			);
		};
	}
	()
);