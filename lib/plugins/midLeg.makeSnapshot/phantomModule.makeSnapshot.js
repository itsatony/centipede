
var makeSnapshot = function(_page, _window, _document, _options) {
	var result = page.render(
		page.options.makeSnapshot.targetFile, 
		{
			format: page.options.makeSnapshot.format, 
			quality: page.options.makeSnapshot.quality
		}
	);
	page.results.makeSnapshot = {
		file: page.options.makeSnapshot.targetFile,
		success: result
	};
};



exports.makeSnapshot = function () {
	return makeSnapshot;
};