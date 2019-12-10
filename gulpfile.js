const gulp = require('gulp');
const fs = require('fs');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const globalVars = require('./src/config/gulp-tasks/_global-vars');

// build all files
gulp.task('build', function() {
	globalVars.createDistFolder();
	globalVars.productionBuild = true;
	runSequence('html-clean', 'html', 'css','css-copy', 'assets');
});

//icon font
gulp.task('iconfont', () => {
	return gulp.src(['src/svg/*.svg'])
		.pipe(iconfontCss({
			fontName: 'svgicons',
			cssClass: 'font',
			path: 'src/config/icon-font.scss',
			targetPath: '../scss/layout/_icon-font.scss',
			fontPath: '../fonts/'
		}))
		.pipe(iconfont({
			fontName: 'svgicons', // required
			prependUnicode: false, // recommended option
			formats: ['ttf', 'woff', 'woff2'], // default, 'woff2' and 'svg' are available
			normalize: true,
			centerHorizontally: true
		}))
		.on('glyphs', (glyphs, options) => {
			// CSS templating, e.g.
			console.log(glyphs, options);
		})
		.pipe(gulp.dest('src/fonts/'));
});

gulp.task('build-dev', function() {
	globalVars.createDistFolder();
	globalVars.productionBuild = false;
	runSequence('html', 'css', 'css-copy', 'js', 'assets');
});

// delete dist folder
gulp.task('reset-dev', function() {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

// start dev tasks
gulp.task('default', function() {
	globalVars.createDistFolder();
	globalVars.productionBuild = false;
	runSequence('html', 'css', 'js', 'watch');
});

// import gulp tasks
require('require-dir')('./src/config/gulp-tasks');
