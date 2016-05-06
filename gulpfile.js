var gulp = require("gulp"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps");

gulp.task("concat", function() {
    return gulp.src("scripts/*.js")
        .pipe(sourcemaps.init())
        .pipe(concat("app.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["concat"]);