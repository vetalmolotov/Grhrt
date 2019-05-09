const gulp = require('gulp');
const concat = require('gulp-concat');
var nodeSass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();


nodeSass.compiler = require('node-sass');

const cssFiles = [
	'./node_modules/normalize.css/normalize.css',
	'./src/css/some.css',
	'./src/css/other.css'
];
const scssFiles = [
	'./node_modules/normalize.css/normalize.css',
	'./src/sass/**/*.scss'
];
const jsFiles = [
	'./src/js/lib.js',
	'./src/js/some.js'
];
const fontFiles = [
	'./src/fonts/*.{ttf,woff,woff2,eot,svg}'
];
const imageFiles = [
	'./src/img/*.{png,jpg,jpeg}'
];
const assetsFiles = [
	'./src/assets/*.svg'
];

function styles() {
	return gulp
				.src(cssFiles)
				.pipe(concat('all.css'))
				.pipe(autoprefixer({
            		browsers: ['last 2 versions'],
            		cascade: false
        		}))
        		.pipe(cleanCSS({
        			level: 2
        		}))
				.pipe(gulp.dest('./build/css'))
				.pipe(browserSync.stream());
}
function sass() {
	return gulp
				.src(scssFiles)
        		.pipe(nodeSass.sync().on('error', nodeSass.logError))
        		.pipe(concat('styles.css'))
				.pipe(cleanCSS({
        			level: 2
        		}))
				.pipe(gulp.dest('./build/css'))
				.pipe(browserSync.stream());
}

function scripts() {
	return gulp
				.src(jsFiles)
				.pipe(concat('all.js'))
				.pipe(uglify({
					toplevel: true
				}))
				.pipe(gulp.dest('./build/js'))
				.pipe(browserSync.stream());

}
function fonts() {
	return gulp
				.src(fontFiles)
				.pipe(gulp.dest('./build/fonts/'))
				.pipe(browserSync.stream());
}
function images() {
	return gulp
		.src(imageFiles)
		.pipe(gulp.dest('./build/img/'))
		.pipe(browserSync.stream());
}
function assets() {
	return gulp
		.src(assetsFiles)
		.pipe(gulp.dest('./build/assets/'))
		.pipe(browserSync.stream());
}

function watch() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
	gulp.watch('./src/sass/**/*.scss', sass);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./src/fonts/**/*.{ttf,woff,woff2,eot,svg}', fonts);
	gulp.watch('./**/*.html', browserSync.reload);
}


function clean() {
	return del(['build/*']);
}


gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('sass', sass);
gulp.task('fonts', fonts);
gulp.task('images', images);
gulp.task('assets', assets);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
							gulp.parallel(sass, fonts, images, assets, scripts)
						));
gulp.task('dev', gulp.series('build', 'watch'));

