
// ---[[[ head.pageCrawl
Redis  = require('redis');

var thisPlugin = {
	id: 'head.pageCrawl',
	executor: function(next, thisEscalator) {
		// ---[[[ all done here
		centipede.PageCrawl = PageCrawl;
		next();
	}
};

// new centipede.PageCrawl(config.job.legs, href, function(errors, results) {]);
PageCrawl = function(legs, href, callWhenDone) {
	var thisPageCrawl = this;
	this.legs = legs;
	this.data = {};
	this.error = null;
	this.href = href;
	this.callWhenDone = callWhenDone;
	this.pageCrawlEscalator = new Escalator('pageCrawl_' + href, [], true);
	this.pageCrawlEscalator.onFinish = function() { 
		log.add('done with : ' + thisPageCrawl.href, 'green', 'PageCrawl', 2);
		thisPageCrawl.callWhenDone(thisPageCrawl.error, thisPageCrawl.data);
	};
	this.pageCrawlEscalator.phantomParameters = [];
	this.pageCrawlEscalator.phantomAnswer = [];
	this.init();
};

PageCrawl.prototype.init = function() {
	var leg, legConfig;
	// front legs are meant to setup stuff 
	// and control phantom parameters
	for (var f = 0; f < this.legs.front.length; f+=1) {
		leg = centipede.legs[this.legs.front[f].id](this.legs.front[f].options);
		this.pageCrawlEscalator.add(leg);
	}
	// then we send phantom to the href
	this.pageCrawlEscalator.add(this.chainSurf());
	// then mid-legs should handle the page content
	for (var f = 0; f < this.legs.mid.length; f+=1) {
		leg = centipede.legs[this.legs.mid[f].id](this.legs.mid[f].options);
		this.pageCrawlEscalator.add(leg);
	}
	// backLegs are there to do something with the data
	// extracted from the page
	for (var f = 0; f < this.legs.back.length; f+=1) {
		leg = centipede.legs[this.legs.back[f].id](this.legs.back[f].options);
		this.pageCrawlEscalator.add(leg);
	}
};


PageCrawl.prototype.chainSurf = function() {
	var thisPageCrawl = this;	
	var leg = {
		id: 'surf',
		executor: function(next, thisEscalator) {
			console.log('---surf');
			centipede.runPhantom(
				thisEscalator.phantomParameters,
				function() {
					thisPageCrawl.phantomAnswer = arguments;
					next();
				}
			);
		}
	};
	return leg;
};
