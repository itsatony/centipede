var page = require('webpage').create(),
    system = require('system'),
    t, address;
var redirectURL = null;
 
if (system.args.length === 1) {
	console.log('Usage: loadspeed.js <some URL>');
	phantom.exit(1);
} else {
	t = Date.now();
	address = system.args[system.args.length-1];
}
// page.onResourceReceived = function(resource) {
	// if (address == resource.url && resource.redirectURL) {
		// console.log('REDIRECT');
		// redirectURL = resource.redirectURL;
	// }
// };
page.onResourceError = function(resourceError) {
  console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
  console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
};
phantom.onError = function(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.error(msgStack.join('\n'));
  phantom.exit(1);
};

page.open(address, function (status) {
		if (status !== 'success') {
				console.log('FAIL to load the address: ' + address);
		} else {
				t = Date.now() - t;
				console.log('Page title is ' + page.evaluate(function () {
						return document.title;
				}));
				console.log('Loading time ' + t + ' msec');
		}
		phantom.exit();
});