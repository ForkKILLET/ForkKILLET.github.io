const gulp = require("gulp");
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");

gulp.task("copy-compiled-css", function () {
    return gulp
        .src("src/style/*.css")
        .pipe(gulp.dest("dist"))
})

gulp.task("bundle", function () {
    return browserify({
        basedir: ".",
        debug: true,
        entries: ["src/main.ts"],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist"));
})

gulp.task("default", gulp.parallel("copy-compiled-css", "bundle"));
