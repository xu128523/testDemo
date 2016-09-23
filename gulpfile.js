var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('gulp-ftp');
var minifycss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');
var rev = require('gulp-rev');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var fs = require('fs');
var shell = require('gulp-shell');

/*-----------------------------get ftp config-----------------------------------*/
var ftpConfig = {ftp_test: {}, ftp_beta: {}, ftp_business: {}, ftp_demo: {}, ftp_test_v4: {}};
//配置文件优先级更
try {
    ftpConfig = require('./ftp.json');
} catch (ex) {
    console.log(ex);
}

/*-----------------------------clean-----------------------------------*/
gulp.task('clean', function () {
    return del(['dist/*'])
});

/*-----------------------------conver scss to css-----------------------------------*/
gulp.task("sass", function () {
    gulp.src(["./sass/app.scss"]).
        pipe(sourcemaps.init()).
        pipe(sass().on("error", sass.logError)).
        pipe(concat("app.css")).
        pipe(minifycss()).
        pipe(sourcemaps.write("./map")).
        pipe(gulp.dest("./css"));
});

// sass watch: once *.scss file is modified, run [sass] task and update css files
gulp.task("sass:watch", function () {
    gulp.watch("./sass/*/*.scss", ["sass"]);
});

/*-----------------------------copy html,image,template-----------------------------------*/
gulp.task('js_online', shell.task('webpack'));

/*-----------------------------copy html,image,template-----------------------------------*/
gulp.task('copycss', ['sass'], function () {
    return gulp.src(['css/**/*']).pipe(gulp.dest('dist/css'));
});
gulp.task('copyindex', function () {
    return gulp.src(['index.html']).pipe(gulp.dest('dist/'));
});
gulp.task('copyindex_v4', function () {
    return gulp.src(['index_sass.html'])
        .pipe(rename('index.html'))
        .pipe(gulp.dest('dist/'));
});
gulp.task('copy_mockdata_v4', function () {
    return gulp.src('mockData/**/*')
        .pipe(gulp.dest('dist/mockData'));
});
gulp.task('copyimages', function () {
    return gulp.src(['images/**']).pipe(gulp.dest('dist/images'));
});

gulp.task('copytemplate', function () {
    return gulp.src(['template/**', '!template/home.html']).pipe(gulp.dest('dist/template'));
});
gulp.task('copyjs', function () {
    return gulp.src(['js/buildRatingEdit.js']).pipe(gulp.dest('dist/js'));
});
gulp.task('copyhtml', function () {
    return gulp.src(['html/buildRatingEdit.html']).pipe(gulp.dest('dist/html'));
});
gulp.task('copyjs_tpl', function () {
    return gulp.src(['js/**/*', '!js/**/*.js']).pipe(gulp.dest('dist/js'));
});
gulp.task('copyjs_online', function () {
    return gulp.src(['js_online/**/*']).pipe(gulp.dest('dist/js_online'));
});
gulp.task('copylib', function () {
    return gulp.src(['lib/*']).pipe(gulp.dest('dist/lib'));
});
gulp.task('copyconfig', function () {
    return gulp.src(['config/*', '!config/webcon*.js']).pipe(gulp.dest('dist/config'));
});
/*-----------------------------update webconfig file-----------------------------------*/
gulp.task('webconfig', function () {
    var argv = require('yargs').argv;
    if (argv.test) {
        return gulp.src(['config/webconfig_test.js'])
            .pipe(rename('webconfig.js'))
            .pipe(gulp.dest('dist/config/'));
    } else if (argv.beta) {
        return gulp.src(['config/webconfig_beta.js'])
            .pipe(rename('webconfig.js'))
            .pipe(gulp.dest('dist/config/'));
    } else if (argv.demo) {
        return gulp.src(['config/webconfig_demo.js'])
            .pipe(rename('webconfig.js'))
            .pipe(gulp.dest('dist/config/'));
    } else if (argv.release) {
        return gulp.src(['config/webconfig_business.js'])
            .pipe(rename('webconfig.js'))
            .pipe(gulp.dest('dist/config/'));
    } else {
        console.log('need --test or --beta or --release');
    }
});

/*-----------------------------upload files by ftp-----------------------------------*/
gulp.task('ftp', function () {
    var argv = require('yargs').argv;
    if (argv.test) {
        return gulp.src('dist/**/*')
            .pipe(ftp(ftpConfig.ftp_test))
            .pipe(gutil.noop());
    } else if (argv.beta) {
        return gulp.src('dist/**/*')
            .pipe(ftp(ftpConfig.ftp_beta))
            .pipe(gutil.noop());
    } else if (argv.demo) {
        return gulp.src('dist/**/*')
            .pipe(ftp(ftpConfig.ftp_demo))
            .pipe(gutil.noop());
    } else if (argv.release) {
        return gulp.src('dist/**/*')
            .pipe(ftp(ftpConfig.ftp_business))
            .pipe(gutil.noop());
    } else {
        console.log('need --test or --beta or --release');
    }
});

gulp.task('ftp_v4', function () {
    return gulp.src('dist/**/*')
        .pipe(ftp(ftpConfig.ftp_test_v4))
        .pipe(gutil.noop());
});
/*-----------------------------uglify js codes-----------------------------------*/
gulp.task('copyjs_uglify', function () {
    return gulp.src(['dist/js/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});
gulp.task('copylib_uglify', function () {
    return gulp.src(['dist/lib/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist/lib'));
});
/*-----------------------------review js codes-----------------------------------*/
gulp.task('jshint', function () {
    return gulp.src('./js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail')); //when find a problem is found, it stop the task.
});

/*-----------------------------publish-----------------------------------*/
gulp.task('publish', function (cb) {
    runSequence('clean', 'js_online', ['copycss', 'copytemplate', 'copyindex', 'copyjs', 'copyjs_tpl', 'copyjs_online', 'copylib', 'copyconfig'],
        ['webconfig'], cb);
});

gulp.task('publish_full', function (cb) {
    runSequence('publish', 'copyimages', cb);
});

gulp.task('publish_full_uglify', function (cb) {
    runSequence('publish', 'copyimages', ['copylib_uglify', 'copyjs_uglify'], cb);
});

/*-----------------------------publish sass4.0-----------------------------------*/
gulp.task('publish_v4', function (cb) {
    runSequence('publish', 'copyindex_v4', 'copy_mockdata_v4', cb);
});

