TESTS = $(shell find ./test -name "*-test.js")
BROWSERS = BS_IE_10 BS_Chrome BS_Firefox BS_Safari

browser:
	mkdir -p browser;
	./node_modules/.bin/browserify ./lib/index.js -o ./browser/bindable.js

all:
	coffee -o lib -c src;

all-watch:
	coffee -o lib -cw src;

clean:
	rm -rf coverage;

testt:
	./node_modules/.bin/_mocha $(TESTS) --ignore-leaks

testling:
	./node_modules/.bin/testling -u


test-cov:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha $(TESTS) --ignore-leaks

test-coveralls:
	./node_modules/.bin/istanbul cover \
	./node_modules/.bin/_mocha $(TESTS) --ignore-leaks --timeout 100 --report lcovonly -- -R spec && \
	cat ./coverage/lcov.info | ./node_modules/.bin/coveralls --verbose
	

