let preprocessor = 'scss';

let srcDir = 'app';
let destDir = 'build';


let imageFiles = 'jpg,png,svg,gif,ico,webp';
let fontFiles = 'woff2,woff';
let scriptFiles = [
	srcDir + '/scripts/tools.js',
	srcDir + '/scripts/main.js',
];


let path = {

	html: {
		src: srcDir + '/*.html',
		dest: destDir + '/',
		watch: srcDir + '/**/*.html'
	},

	styles: {
		src: srcDir + '/styles/**/*.' + preprocessor,
		dest: destDir + '/css/',
	},

	images: {
		src: srcDir + '/images/**/*.{' + imageFiles + '}',
		dest: destDir + '/images/',
	},

	scripts: {
		src: srcDir + '/scripts/**/*.js',
		dest: destDir + '/scripts/',
	},

	fonts: {
		src: srcDir + '/fonts/',
		dest: destDir + '/fonts/',
	},

	delete: destDir,
	cssOutputName: 'main.min.css',
	jsOutputName: 'main.min.js',
}



const gulp = require('gulp');
const { src, dest, parallel, series, watch, task } = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');

const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');

const sass = require('gulp-sass');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');

const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html');
const webpcss = require('gulp-webpcss');

const uglify = require('gulp-uglify-es').default;

const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const ttf2woff = require('gulp-ttf2woff');



function html() {
	return src(path.html.src)
		.pipe(plumber())
		.pipe(fileinclude({ prefix: '@@' }))
		.pipe(webpHTML())
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(dest(path.html.dest))
		.pipe(browserSync.stream());
}

function css() {
	return src(path.styles.src)
		.pipe(plumber())
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(webpcss({}))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 3 version'],
			cascade: false
		}))
		.pipe(groupMedia())
		.pipe(dest(path.styles.dest))
		.pipe(concat(path.cssOutputName))
		.pipe(cleanCSS({
			level: 2,
			compatibility: 'ie8'
		}))
		.pipe(dest(path.styles.dest))
		.pipe(browserSync.stream())
}

function img() {
	return src(path.images.src)
		.pipe(newer(path.images.dest))
		.pipe(webp())
		.pipe(dest(path.images.dest))
		.pipe(src(path.images.src))
		.pipe(imagemin())
		.pipe(dest(path.images.dest))
		.pipe(browserSync.stream())
}

function js() {
	return src(scriptFiles)
		// .pipe(plumber())
		.pipe(concat(path.jsOutputName))
		.pipe(uglify())
		.pipe(dest(path.scripts.dest))
		.pipe(browserSync.stream())
}

function fnt() {
	return src(path.fonts.src + '/*.{' + fontFiles + '}')
		.pipe(dest(path.fonts.dest));
}

function clear() {
	return del(path.delete, { force: true });
}

function clearFnt() {
	return del(path.fonts.src + '*.*', { force: true });
}

function dev() {
	browserSync.init({
		server: { baseDir: destDir + '/' },
		port: 3000,
		notify: true
	});
	watch([path.html.watch], html);
	watch([srcDir + '/**/*.' + preprocessor], css);
	watch([srcDir + '/**/*.{' + imageFiles + '}'], img);
	watch([srcDir + '/**/*.js'], js);
	watch([srcDir + '/**/*.{' + fontFiles + '}'], fnt);
}

gulp.task('otf2ttf', function() {
	return src(path.fonts.src + '/src/*.otf')
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(dest(path.fonts.src + '/src/'));
});

gulp.task('ttf2woff', function() {
	return src(path.fonts.src + '/src/*.ttf')
		.pipe(ttf2woff())
		.pipe(dest(path.fonts.src));
});

gulp.task('ttf2woff2', function () {
	return src(path.fonts.src + '/src/*.ttf')
		.pipe(ttf2woff2())
		.pipe(dest(path.fonts.src));
});

gulp.task('fonts', series(clearFnt, 'otf2ttf', 'ttf2woff', 'ttf2woff2'));



const build = series(clear, parallel(css, img, js, fnt), html);
const watcher = parallel(build, dev);

exports.clearFnt = clearFnt;
exports.clear = clear;
exports.html = html;
exports.css = css;
exports.img = img;
exports.js = js;
exports.fnt = fnt;
exports.dev = dev;
exports.build = build;
exports.watcher = watcher;
exports.default = watcher;