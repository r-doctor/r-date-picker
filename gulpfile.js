const gulp = require('gulp');
const babel = require('gulp-babel');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const watch = require('gulp-watch');
const uglify = require('gulp-uglify');
const cssClean = require('gulp-clean-css');
const rename = require('gulp-rename');


gulp.task('js', () => {
    return watch('./src/**/*.js', () => {
        gulp.src('./src/rdatepicker.js')
            .pipe(babel())
            .pipe(gulp.dest('./dist'))
    })
});

gulp.task('css', () => {
    return watch('./src/less/**/*.less', () => {
        gulp.src('./src/less/rdatepicker.less')
            .pipe(less())
            .pipe(postcss([autoprefixer()]))
            .pipe(gulp.dest('./dist'))
    })
});

gulp.task('uglify', () => {
    gulp.src('./dist/rdatepicker.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/compress'));
});

gulp.task('cssmini', () => {
    gulp.src('./dist/rdatepicker.css')
        .pipe(cssClean())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/compress'));
});


gulp.task('compress', ['uglify', 'cssmini']);

gulp.task('default', ['js', 'css']);