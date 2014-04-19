#!/usr/bin/env node

var centipede = require('../'); 

if (typeof process.argv[2] === 'undefined') {
	console.log('centipede ---[[[ Usage: centipede <configfile> ]]]---');
	process.exit();
} else {
	centipede(process.argv[2]);
}

