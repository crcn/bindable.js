ONLY='.'

browser:
	mkdir -p browser;
	./node_modules/.bin/browserify ./lib/index.js -o ./browser/bindable.js

all:
	coffee -o lib -c src;

all-watch:
	coffee -o lib -cw src;

clean:
	rm -rf coverage;

lint:
	./node_modules/.bin/jshint ./lib --config jshint.json

test-node: lint
	./node_modules/.bin/_mocha $(TESTS) --ignore-leaks

test-watch:
	./node_modules/.bin/_mocha $(TESTS) --ignore-leaks -g $(ONLY) --watch ./lib ./test


testling:
	./node_modules/.bin/testling -u --port=8070

chunnel:
	chunnel connect http://127.0.0.1:8090@http://127.0.0.1:8080 --server=WIN-Q9J83OJ0VCB.local:9526

test-cov:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha $(TESTS) --ignore-leaks

test-coveralls:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha $(TESTS) --ignore-leaks --timeout 100 --report lcovonly -- -R spec && \
	cat ./coverage/lcov.info | ./node_modules/.bin/coveralls --verbose
