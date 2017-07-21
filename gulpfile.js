//	Import modules for job
const gulp 		= require('gulp');
const del 		= require('del');					//	delete folders
// const htmlmin = require('gulp-html-minifier');
const less 		= require('gulp-less');				//	transfer less to css
const minifycss 	= require('gulp-clean-css');		//	minify css code
const uglify 		= require('gulp-uglify');			//	minify js code
const imagemin 	= require('gulp-imagemin');
const imageminOptipng = require('imagemin-optipng');
const imageminJpegtran = require('imagemin-jpegtran');
// const rename = require("gulp-rename");
const gulpSequence = require('gulp-sequence');		// task sychronose tools
const argv 		= require('yargs').argv;			//	for passing arguments from command line
const jshint 		= require('gulp-jshint');			//	for js code check
const qunit 		= require('gulp-qunit');			//	for qunit test
const browserSync = require("browser-sync").create();	//	auto refresh browser after change
const babel = require('gulp-babel');		//	translate ES6 to ES5


//	Define constant
const ENV_Production 	= "prod";
const ENV_Development 	= "dev";
const ENV_UnitTest 		= "devtest";


//	Define target folder
var destDir, JsonConfig, JsonConfigDest;
if(argv.env == ENV_Production){
	destDir = "./dist";
	// JsonConfig = "src/Content/json/config.json";
	// JsonConfigDest = destDir + "/Content/json";
}else if(argv.env == ENV_UnitTest){
	destDir = "./devtest";
}else{
	destDir = "./dev";
	// JsonConfig = "src/Content/json/config-mock.json";
	// JsonConfig = "src/Content/json/config.json";
	// JsonConfigDest = destDir + "/Content/json";
}


// setting the path
var paths = {
	less: 'src/less/*.less',
	lessDest: destDir + '/stylesheet',
	appjs: 'src/js/*.js',
	appjsDest: destDir + '/javascript',
	venderJS: ['vendor/jquery/dist/jquery.min.js', 'vendor/lodash/dist/lodash.min.js'],
	venderJSDest: destDir + '/javascript/libs',
	appviews: 'src/views/*.html',
	appviewsDest: destDir + '/views',
	appjson: 'src/json/*.json',
	appjsonDest: destDir + '/json',
	appresource: 'src/resource/**/*',
	appresourceDest: destDir + '/resource',
	mockdata: 'src/mockdata/*.json',
	mockdataDest: destDir + '/mockdata',
	test: './test/*.*'
};


// clean the dist folder
gulp.task('clean', function() {
	return del(destDir);
});

// deal with html
// gulp.task('minify-html', function() {
//   gulp.src('./src/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('./dist'))
// });


// Transfer less to css, and do minification
gulp.task('less', function () {
	if(argv.env == ENV_Production) {
		return gulp.src(paths.less)
		.pipe(less())
		.pipe(minifycss())
		.pipe(gulp.dest(paths.lessDest))
		.pipe(browserSync.reload({stream:true}));
	}else{
		return gulp.src(paths.less)
		.pipe(less())
		.pipe(gulp.dest(paths.lessDest))
		.pipe(browserSync.reload({stream:true}));
	}
});


// Copying and minifying js files
gulp.task('js', function() {
	// Minify and copy all JavaScript (except vendor scripts) 
	// with sourcemaps all the way down
	if(argv.env == ENV_Production) {
		return gulp.src(paths.appjs)
		.pipe(babel({presets: ['es2015']}))
		// .pipe(sourcemaps.init())
		.pipe(uglify())
		// .pipe(concat('all.min.js'))
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.appjsDest))
		.pipe(browserSync.reload({stream:true}));
	}else{
		gulp.src(paths.venderJS)
		.pipe(gulp.dest(paths.venderJSDest));
		
		return gulp.src(paths.appjs)
		.pipe(babel({presets: ['es2015']}))
		.pipe(gulp.dest(paths.appjsDest))
		.pipe(browserSync.reload({stream:true}));
	}
});


//	Copying files to target folder
gulp.task("copy", function(){
	// if(gulp.env._ == "dev"){
	// 	gulp.src([paths.appjson, '!src/Content/json/config.json'])
	// 	.pipe(gulp.dest(paths.appjsonDest));
	// }

	return gulp.src(paths.venderJS)
	.pipe(gulp.dest(paths.venderJSDest)),
	gulp.src(paths.appjson)
	.pipe(gulp.dest(paths.appjsonDest)),
	gulp.src(paths.appviews)
	.pipe(gulp.dest(paths.appviewsDest)),
	gulp.src(paths.appresource)
	.pipe(gulp.dest(paths.appresourceDest)),
	gulp.src(paths.mockdata)
	.pipe(gulp.dest(paths.mockdataDest)),
	gulp.src(['src/*.*'])
	.pipe(gulp.dest(destDir));
});


//	checking js files
gulp.task("jshint", function(){
	return gulp.src(paths.appjs)
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});


//	run unit test
gulp.task("qunit", function(){
	return gulp.src(paths.test)
	.pipe(qunit());
});


// Copy all static images 
gulp.task('imagemin', function() {
    // var jpgmin = imageminJpegRecompress({
    //         accurate: true,//高精度模式
    //         quality: "medium",//图像质量:low, medium, high and veryhigh;
    //         method: "smallfry",//网格优化:mpe, ssim, ms-ssim and smallfry;
    //         min: 70,//最低质量
    //         loops: 0,//循环尝试次数, 默认为6;
    //         progressive: false,//基线优化
    //         subsample: "default"//子采样:default, disable;
    //     });
    var pngmin = imageminOptipng({
            optimizationLevel: 5
        });
    gulp.src('src/resource/book/**/*.png')
        .pipe(imagemin({
            // use: [jpgmin, pngmin]
            use: [pngmin]
        }))
        .pipe(gulp.dest('dev/resource/book'));
});


// Rerun the task when a file changes 
gulp.task('watch', function() {
	gulp.watch(paths.less, ['less']);
	gulp.watch(paths.appjs, ['js']);
	gulp.watch(paths.appviews, function(){
		return gulp.src(paths.appviews)
		.pipe(gulp.dest(paths.appviewsDest));
	});
	gulp.watch(paths.appjson, function(){
		return gulp.src(paths.appjson)
		.pipe(gulp.dest(paths.appjsonDest));
	});
	gulp.watch('src/*.*', function(){
		return gulp.src(['src/*.*'])
		.pipe(gulp.dest(destDir));
	});
});


//	watch and auto sync change to browser, and start server
gulp.task('browserSync', ['less', 'js'], function() {
	//	set server
    browserSync.init({
        server: destDir
    });

    gulp.watch(paths.less, ['less']);
	gulp.watch(paths.appjs, ['js']);
    gulp.watch(paths.appviews, function(){
		return gulp.src(paths.appviews)
		.pipe(gulp.dest(paths.appviewsDest))
		.pipe(browserSync.reload({stream:true}));
	});
});


// gulp.task('default', ['watch', 'scripts', 'images']);
gulp.task('default', gulpSequence('clean', 'less', 'js', 'copy'));
gulp.task('test', gulpSequence('clean', 'less', 'js', 'copy', 'jshint', 'qunit'));