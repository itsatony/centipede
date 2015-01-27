var grabLinks = function(_page, _window, _document, _options) {
	page.results.grabLinks = {	};
	console.log('--GRABLINKS -> ');
	var allLinks = extractAllLinks.apply(this,[ _page, _document ]);
	page.results.grabLinks.all = allLinks;
	page.whatIsDone.grabLinks = true;
};



exports.grabLinks = function () {
	return grabLinks;
};


function extractAllLinks(page, document) {
	var links = page.evaluate(
		function() {
			return [].map.call(
				document.querySelectorAll('a'), 
				function(link) {
					return link.getAttribute('href');
				}
			);
		}
	);
	return links;
};