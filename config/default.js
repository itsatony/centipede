var homeDir = process.cwd();
var pluginsDir = homeDir + '/lib/plugins';
var resultsDir = homeDir + '/results'
var snapshotDir = homeDir + '/snapshot'
var centipedeInstanceId = 'cpd01'; 
var config = {
	id: centipedeInstanceId,
	directories: {
		home: process.cwd(),
		config: __dirname,
		plugins: pluginsDir,
		results: resultsDir,
		snapshots: snapshotDir
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
		executable: process.cwd() + '/bin/phantom',
		timeout: 20000
	},
	head: {
		redis: {
			host: '127.0.0.1',
			port: '6739',
			// username: '',
			// password: '',
			recordPrefix: centipedeInstanceId
		}
	},
	plugins: [
		// pluginsDir + '/head.redisClient/head.redisClient',
		pluginsDir + '/head.queue/head.queue',
		pluginsDir + '/frontLeg.getNextQueueUrl/frontLeg.getNextQueueUrl',
		pluginsDir + '/frontLeg.setUserAgent/frontLeg.setUserAgent',
		pluginsDir + '/frontLeg.setViewPort/frontLeg.setViewPort',
		pluginsDir + '/frontLeg.checkRobotsTxt/frontLeg.checkRobotsTxt',
		pluginsDir + '/midLeg.grabLinks/midLeg.grabLinks',
		pluginsDir + '/midLeg.makeSnapshot/midLeg.makeSnapshot',
		pluginsDir + '/backLeg.queueLinks/backLeg.queueLinks',
		pluginsDir + '/backLeg.queueDomains/backLeg.queueDomains',
	],
	job: {
		id: 'deLinkAnalysis',
		queue: {
			db: {
				host: '127.0.0.1',
				port: '6739',
				// username: centipedeInstanceId,
				// password: 'somePassWord',
				recordPrefix: centipedeInstanceId,
				queueSourceSetKey: centipedeInstanceId + ':dom:de',
				queueSetKey: centipedeInstanceId + ':q:dom'
			},
		},
		legs: {
			front: [
				{
					id: 'getNextQueueUrl',
					options: {
						db: {
							host: 'localhost',
							port: '6739',
							// username: centipedeInstanceId,
							// password: 'somePassWord',
							recordPrefix: centipedeInstanceId
							queueKey: centipedeInstanceId + ':q:deLinkAnalysis:urls'
						}
					}
				},
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
					id: 'checkRobotsTxt',
				}
			],
			mid: [
				{
					id: 'grabLinks',
				},
				{
					id: 'makeSnapshot',
					options: {
						format: 'jpeg',
						quality: 80
					}
				},
			],
			back: [
				{
					id: 'queueLinks',
					options: {
						whiteList: {
							tld_de: new RegExp("^http(|s):\/\/(.*?\.(de|at|ch))(?!\.)", "i")
						},
						blackList: {
						},
						db: { 
							host: 'localhost',
							port: '6739',
							// username: centipedeInstanceId,
							// password: 'somePassWord',
							queueKey: centipedeInstanceId + ':q:deLinkAnalysis:urls'
						}
					}
				},
				{
					id: 'queueDomains', 
					options: {
						whiteList: {
							tld_de: new RegExp("\.de($|\/)", "i")
						},
						blackList: {
						},
						db: { 
							host: 'localhost',
							port: '6739',
							// username: centipedeInstanceId,
							// password: 'somePassWord',
							queueKey: centipedeInstanceId + ':q:dom:de'
						}
					}
				}
			]
		}
	}
};
module.exports = config;