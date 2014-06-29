
// ---[[[ head.pageCrawl
Redis  = require('redis');

var thisPlugin = {
	id: 'head.pageCrawl',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.pageCrawl = pageCrawl;
		next();
	}
};


PageCrawl = function(legs, href, callWhenDone) {
	var thisPageCrawl = this;
	this.legs = legs;
	this.data = {};
	this.error = null;
	this.href = href;
	this.callWhenDone = callWhenDone;
	this.pageCrawlEscalator = new Escalator('pageCrawl_' + href, [], true);
	this.frontEscalator.onFinish = function() { 
		log.add('done with : ' + thisPageCrawl.href, 'green', 'PageCrawl', 2);
		thisPageCrawl.callWhenDone(thisPageCrawl.error, thisPageCrawl.data);
	};
	this.frontEscalator = new Escalator('pageCrawl_front_' + href, [], true);
	this.frontEscalator.onFinish = function() { 
		thisPageCrawl.pageCrawlEscalator.next(); 
	};
	this.frontEscalator.parentEscalator = this.pageCrawlEscalator;
	this.midEscalator = new Escalator('pageCrawl_mid_' + href, [], true);
	this.midEscalator.onFinish = function() { 
		thisPageCrawl.pageCrawlEscalator.next(); 
	};
	this.backEscalator = new Escalator('pageCrawl_back_' + href, [], true);
	this.backEscalator.onFinish = function() { 
		thisPageCrawl.pageCrawlEscalator.next(); 
	};
	this.pageCrawlEscalator.add(runFrontLegs());
	this.pageCrawlEscalator.add(runMidLegs());
	this.pageCrawlEscalator.add(runBackLegs());
	this.init();
};

PageCrawl.prototype.init = function() {
	var leg, legConfig;
	for (var f = 0; f < this.legs.front.length; f+=1) {
		leg = centipede.legs[this.legs.front[f].id](this.legs.front[f].options);
		this.frontEscalator.add(leg);
	}
	for (var f = 0; f < this.legs.mid.length; f+=1) {
		leg = centipede.legs[this.legs.mid[f].id](this.legs.mid[f].options);
		this.midEscalator.add(leg);
	}
	for (var f = 0; f < this.legs.back.length; f+=1) {
		leg = centipede.legs[this.legs.back[f].id](this.legs.back[f].options);
		this.backEscalator.add(leg);
	}
};

PageCrawl.prototype.runFrontLegs = function() {
	var thisPageCrawl = this;
	return {
		id: 'runFrontLegs',
		executor: function(nextSegment, pageCrawlEscalator) {
			thisPageCrawl.frontEscalator.run();
		}
	};	
};

PageCrawl.prototype.runMidLegs = function() {
	var thisPageCrawl = this;
	return {
		id: 'runMidLegs',
		executor: function(nextSegment, pageCrawlEscalator) {
			thisPageCrawl.midEscalator.run();
		}
	};	
};

PageCrawl.prototype.runBackLegs = function() {
	var thisPageCrawl = this;
	return {
		id: 'runBackLegs',
		executor: function(nextSegment, pageCrawlEscalator) {
			thisPageCrawl.backEscalator.run();
		}
	};	
};

PageCrawl.prototype.surf = function() {
	
	
	var leg = {
		id: 'surf',
		executor: function(next, thisEscalator) {
			console.log('---surf');
			centipede.runPhantom(
				parameters,
				function() {
					thisPageCrawl.runMidLegs(
						arguments,
						next
					);
				}
			);
		}
	};
	
};
