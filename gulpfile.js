const { series } = require('gulp');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pipeline = require('readable-stream').pipeline;

  // build_js;

  // build_static;

  // build_assets;

  // build_garbage;


function jsTranspile(cb) {

  // echo " Gradient JS";
  // uglifyjs -m \
  //   -c sequences=true,dead_code,conditionals,booleans,unused,if_return,join_vars \
  //   --source-map url=gradient.min.js.map \
  //   -o $OUT/js/gradient.min.js \
  //   $SRC/_js/gradient.js;

  return pipeline(
        gulp.src('./src/_js/gradient.js'),
        uglify(),
        gulp.dest('./www/js')
  );
  // cb();
}

function cssTranspile(cb) {
  cb();
}

function assets(cb) {
  cb();
}

function garbage(cb) {
  cb();
}

exports.default = series(jsTranspile,cssTranspile,assets,garbage);