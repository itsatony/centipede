(function() {
	if ( wappalyzer == null ) {
		return;
	}
	var w = wappalyzer;
	w.driver = {
		/**
		 * Log messages to console
		 */
		log: function(args) {
			if ( console != null ) console[args.type](args.message);
		},
		/**
		 * Initialize
		 */
		init: function() {
		},
		/**
		 * Display apps
		 */
		displayApps: function(url) {
			//w.detected[url].map(
				// function(app) {
					// console.log('DETECTED APP');
				// }
			// );
		},
		/**
		 * Go to URL
		 */
		goToURL: function(args) {
			// console.log('GOTO URL CALLED');
			//window.open(args.url);
		}
	};
	w.init();
})();
