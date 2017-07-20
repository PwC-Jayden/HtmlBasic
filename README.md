bower.json: dependence 3rd part files
.bowerrc: bower file install directory

.gitignore: ignore files from git


Initiate Project:
1. npm install
2. bower install

Build Project:
	Build Project via gulp:
		Dev: gulp --env dev
		Test: gulp test --env dev	//	run the qunit test and jshint
		Prod: gulp --env prod	//	minify js and css file

	Build Project via npm:
		refer to package.json

Developing Project:
	>npm run dev

How to use:
1. >npm install
2. >bower install
3. >npm run build
4. >npm run dev
5. start "startserver.cmd" in dev folder