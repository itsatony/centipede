
var makeSnapshot = function(_page, _window, _document, _options) {
	console.log('-- make Snap Shot');
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
	page.whatIsDone.makeSnapshot = true;
};



exports.makeSnapshot = function () {
	return makeSnapshot;
};