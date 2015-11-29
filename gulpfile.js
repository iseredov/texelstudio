var gulp = require('gulp'),
    sass = require('gulp-sass') ,
    notify = require("gulp-notify") ,
    bower = require('gulp-bower'),
    sourcemaps = require('gulp-sourcemaps'),
    connect      = require('gulp-connect'),
    handlebars   = require('gulp-compile-handlebars'),
    autoprefixer = require('gulp-autoprefixer');
    plumber = require('gulp-plumber');
    templateData = require('./src/html/data.json');


var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

// source and distribution folder
var
    source = 'src/',
    dest = 'public/';

// Bootstrap scss source
var bootstrapSass = {
    in: './bower_components/bootstrap-sass'
};

// fonts
var fonts = {
    in: [source + 'fonts/*.*', bootstrapSass.in + '/assets/fonts/**/*'],
    out: dest + 'fonts/'
};

// images
var img = {
    in: [source + 'img/*.*'],
    watch: source + 'img/**/*.*',
    out: dest + 'img/'
};

// css source file: .scss files
var css = {
    in: source + 'scss/*.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        includePaths: [bootstrapSass.in + '/assets/stylesheets']
    }
};

var html = {
    in: source + 'html',
    watch: source + 'html/**/*.*',
    out: dest
};

var errors = {
    defaultError: function(err){
        console.log(err);
        notify.onError({
            title: 'Error in <%= error.plugin %>',
            message: '<%= error.filename %>:<%= error.line %>',
            sound: 'Glass'
        })(err);
    }
};

// copy bootstrap required fonts to dest
gulp.task('fonts', function () {
    return gulp
        .src(fonts.in)
        .pipe(gulp.dest(fonts.out))
});

// copy bootstrap required fonts to dest
gulp.task('images', function () {
    return gulp
        .src(img.in)
        .pipe(gulp.dest(img.out))
        .pipe(connect.reload())
});

gulp.task('html', function(){
    gulp.src(html.in + '/*.html')
        .pipe(plumber({errorHandler: errors.defaultError}))
        .pipe(handlebars(templateData, {batch : [html.in + '/partials']}))
        .pipe(gulp.dest(html.out))
        .pipe(connect.reload())
});

gulp.task('css', function() {
    return gulp
        .src(css.in)
        .pipe(plumber({errorHandler: errors.defaultError}))
        //.pipe(sourcemaps.init())
        .pipe(sass(css.sassOpts))
        //.pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(css.out))
        .pipe(connect.reload())
});

gulp.task('server', function(){
    connect.server({
        root: dest,
        livereload: true,
        port: 8888
    });
});

gulp.task('watch', function(){
    gulp.watch(css.watch, ['css']);
    gulp.watch(html.watch, ['html']);
    gulp.watch(img.watch, ['images']);

});

// compile scss
gulp.task('build', ['fonts','css','html','images'], function () {
    return gulp.src(css.in)
        .pipe(sass(css.sassOpts))
        .pipe(gulp.dest(css.out));
});

gulp.task('default', ['css','images','html','server','watch']);
