var centipede = require ('../lib/centipede');
var should = require('should');
var helpers = {}; 

describe(
	'run some test',
	function() {
		it(
			'should do something', 
			function(done) {
				should.exist(centipede);
				centipede.should.be.type('object');
				done();
			}
		);
	}
);
