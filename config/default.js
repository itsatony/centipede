var pluginsDir = process.cwd() + '/lib/plugins';
var centipedeInstanceId = 'centi1'; 
var config = {
	id: centipedeInstanceId,
	debug: true,
	repl: {
		port: 'localhost',
		host: 9999,
	},
	lg: {
		log2console:true
	},
	plugins: [
		pluginsDir + '/frontLeg.getNextQueueUrl',
		pluginsDir + '/frontLeg.setUserAgent',
		pluginsDir + '/frontLeg.setViewPort',
		pluginsDir + '/frontLeg.checkRobotsTxt',
		pluginsDir + '/midLeg.grabLinks',
		pluginsDir + '/midLeg.makeSnapshot',
		pluginsDir + '/backLeg.queueLinks',
		pluginsDir + '/backLeg.queueDomains',
	],
	jobs: [
		{
			id: 'deLinkAnalysis',
			sourceSetKey: 'cpd:dom:de',
			db: {
				host: 'redis.centipede.io',
				port: '6739',
				username: centipedeInstanceId,
				password: 'somePassWord'
			},
			legs: {
				front: [
					{
						id: 'getNextQueueUrl',
						db: {
							host: 'localhost',
							port: '6739',
							username: centipedeInstanceId,
							password: 'somePassWord',
							queueKey: 'centi1:q:deLinkAnalysis:urls'
						}
					},
					{
						id: 'setUserAgent',
						ua: [
							'googleBot'
						]
					},
					{
						id: 'setViewPort',
						x: 1024,
						y: 768
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
						box: {
							x0:0,
							y0:0,
							x1:100,
							y1:100
						},
						target: '{{snapdir}}snap_{{md5_url}}.jpg'
					},
				],
				back: [
					{
						id: 'queueLinks',
						whiteList: {
							tld_de: new RegExp("^http(|s):\/\/(.*?\.(de|at|ch))(?!\.)", "i")
						},
						blackList: {
						},
						db: { 
							host: 'localhost',
							port: '6739',
							username: centipedeInstanceId,
							password: 'somePassWord',
							queueKey: 'centi1:q:deLinkAnalysis:urls'
						}
					},
					{
						id: 'queueDomains', 
						whiteList: {
							tld_de: new RegExp("\.de($|\/)", "i")
						},
						blackList: {
						},
						db: { 
							host: 'redis.centipede.io',
							port: '6739',
							username: centipedeInstanceId,
							password: 'somePassWord',
							queueKey: 'cpd:q:dom:de'
						}
					}
				]
			}
		}
	]
};
module.exports = config;