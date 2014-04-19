test:
	./node_modules/.bin/mocha \ 
		--timeout 5000 \
		--ui bdd \
		--reporter spec 
		test/centipede.js

	
.PHONY: test
