all:
	coffee -o lib -c src	

watch: 
	coffee -o lib -cw src

clean:
	rm -rf lib



