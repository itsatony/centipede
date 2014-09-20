var homeDir = process.cwd();
var pluginsDir = homeDir + '/lib/plugins';
var crawlsDir = homeDir + '/crawls/{{crawlDir}}';
var centipedeInstanceId = 'cpd01'; 
var config = {
	id: centipedeInstanceId,
	directories: {
		home: process.cwd(),
		config: __dirname,
		plugins: pluginsDir,
		crawls: crawlsDir
	},
	debug: {
		bubPubSub: false,
		escalator: false
	},
	repl: {
		host: 'localhost',
		port: 9999,
	},
	lg: {
		log2console:true,
		loglevel: 0
	},
	phantom: {
		// see http://phantomjs.org/build.html
		// or   sudo apt-get install phantomjs
		//      
		executable: '/usr/bin/phantomjs',
		timeout: 10000
	},
	head: {
		redis: {
			host: '127.0.0.1',
			port: '6379',
			// username: '',
			// password: '',
			recordPrefix: centipedeInstanceId
		}
	},
	plugins: [
		// pluginsDir + '/head.redisClient/head.redisClient',
		pluginsDir + '/head.queue/head.queue',
		pluginsDir + '/head.pageCrawl/head.pageCrawl',
		pluginsDir + '/frontLeg.setSSL/frontLeg.setSSL',
		pluginsDir + '/midLeg.setUserAgent/midLeg.setUserAgent',
		pluginsDir + '/midLeg.setViewPort/midLeg.setViewPort',
		// pluginsDir + '/midLeg.checkRobotsTxt/midLeg.checkRobotsTxt',
		// pluginsDir + '/midLeg.grabLinks/midLeg.grabLinks',
		pluginsDir + '/midLeg.makeSnapshot/midLeg.makeSnapshot',
		pluginsDir + '/midLeg.har/midLeg.har',
		// pluginsDir + '/backLeg.queueLinks/backLeg.queueLinks',
		// pluginsDir + '/backLeg.queueDomains/backLeg.queueDomains',
	],
	job: {
		id: 'deLinkAnalysis',
		queue: {
			db: {
				host: '127.0.0.1',
				port: '6379',
				// username: centipedeInstanceId,
				// password: 'somePassWord',
				recordPrefix: centipedeInstanceId,
				// for tests:  sadd cpd01:dom:de "http://sistrix.de" "http://zeit.de" "http://kicker.de"
				queueSourceSetKey: centipedeInstanceId + ':dom:de',
				queueSetKey: centipedeInstanceId + ':q:dom'
			},
		},
		legs: {
			front: [
				
			],
			mid: [
				{
					id: 'setUserAgent',
					options: {
						ua: 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'
					}
				},
				{
					id: 'setViewPort',
					options: {
						x: 1024,
						y: 768
					}
				},
				{
					id: 'makeSnapshot',
					options: {
						format: 'jpeg',
						quality: 80
					}
				},
				{
					id: 'har',
					options: {
						
					}
				},
				// {
					// id: 'grabLinks',
				// },
			],
			back: [
				// {
					// id: 'queueLinks',
					// options: {
						// whiteList: {
							// tld_de: new RegExp("^http(|s):\/\/(.*?\.(de|at|ch))(?!\.)", "i")
						// },
						// blackList: {
						// },
						// db: { 
							// host: 'localhost',
							// port: '6379',
							// queueKey: centipedeInstanceId + ':q:deLinkAnalysis:urls'
						// }
					// }
				// },
				// {
					// id: 'queueDomains', 
					// options: {
						// whiteList: {
							// tld_de: new RegExp("\.de($|\/)", "i")
						// },
						// blackList: {
						// },
						// db: { 
							// host: 'localhost',
							// port: '6379',
							// queueKey: centipedeInstanceId + ':q:dom:de'
						// }
					// }
				// }
			]
		}
	}
};
module.exports = config;