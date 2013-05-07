all:
	coffee -o lib -c src	

watch: 
	coffee -o lib -cw src

clean:
	rm -rf lib
	rm -rf test-web;



browser:
	sardines ./lib/index.js -o ./build/bindable.js -p browser

test-web:
	rm -rf test-web;
	cp -r test test-web;
	for F in `ls test-web | grep test`; do ./node_modules/.bin/sardines "test-web/$$F" -o "test-web/$$F" -p browser; done






