// Import required dependencies.
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    browserSyncReload = browserSync.reload,
    sass = require('gulp-sass'),
    filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    del = require('del'),
    runSequence = require('run-sequence');

// Define project paths.
// Note: all of these are relative to the project root.
var projectPaths = {
    sources: {
        scss: 'src/scss/**/*.scss',
        html: 'src/html/**/*.html',
        images: 'src/images/**/*',
        fonts: 'src/fonts/**/*',
        scripts: 'src/js/**/*'
    },
    distRoot: 'dist',
    testRoot: 'test',
    testDistRoot: 'test/dist'
};

var browserSyncConfig = {
    server: {
        baseDir: './' + projectPaths.testRoot
    },
    files: [
        // TODO: Can this be simplified?
        projectPaths.testRoot + '/css/*.css',
        projectPaths.testRoot + '/*.html',
        projectPaths.testRoot + '/js/*.js'
    ]
};

gulp.task('clean', function (cb) {
  del([
    // Clean out dist folder
    projectPaths.distRoot,

    // Clean out test/dist folder
    projectPaths.testDistRoot
  ], cb);
});

gulp.task('sass', function() {
   return gulp.src(projectPaths.sources.scss)
        .pipe(sass())
        .pipe(gulp.dest(projectPaths.distRoot))
        .pipe(filter('**/*.css'))
        .pipe(browserSyncReload({stream: true}));
});

gulp.task('browser-sync', function() {
    browserSync(browserSyncConfig);
});

gulp.task('copy-dist-test', function() {
  gulp.src(projectPaths.distRoot + '/**/*')
    .pipe(gulp.dest(projectPaths.testDistRoot));
});

gulp.task('watch', function() {
    gulp.watch(projectPaths.sources.scss, ['sass']);
});

gulp.task('build', ['sass']);

gulp.task('copy-scss', function () {
  gulp.src(projectPaths.sources.scss)
    .pipe(filter(['*', '!harvest.scss']))
    .pipe(gulp.dest(projectPaths.distRoot));
});

gulp.task('build-dist', ['build', 'copy-scss']);

gulp.task('dist', function (cb) {
  runSequence('clean', 'build-dist', cb);
});

gulp.task('test-build', function (cb) {
  runSequence('dist', 'copy-dist-test', cb);
});

gulp.task('test-serve', function (cb) {
  runSequence('test-build', 'watch', 'browser-sync', cb);
});

gulp.task('default', ['clean-build']);
