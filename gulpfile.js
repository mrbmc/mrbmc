const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css'); // If you want CSS minification
const rsync = require('gulp-rsync');
const exec = require('child_process').exec;

// Define paths
const paths = {
  // js: 'src/_js/**/*.js',
  js: ['src/_js/mrbmc.js'],
  css: 'src/_scss/!(_*).scss',
  images: 'src/images/**/*',
  html: ['src/**/*.md', 'src/**/*.njk'] // Eleventy source files (assuming Markdown or Nunjucks)
};

// Compile and minify JavaScript
function buildJS() {
  return src(paths.js)
    .pipe(uglify())
    .pipe(dest('www/js'));
}

// Compile SCSS to CSS
function compileCSS() {
  return src(paths.css)
    .pipe(sass({ 
      outputStyle: 'compressed', 
      sourceMaps: false
    }).on('error', sass.logError))
    .pipe(cleanCSS()) // Optional, if you want CSS minification
    .pipe(dest('www/css'));
}

// Build HTML with Eleventy
function buildHTML() {
  return exec('npx @11ty/eleventy', (err, stdout) => {
    console.log(stdout);
    if (err) throw err;
  });
}

// Sync static assets (images)
function syncAssets() {
  const options = {
    root: 'src/images/',
    destination: 'www/images',
    exclude: ['portfolio/**/*'],
    delete: true,
    progress: true
  };
  return src(paths.images).pipe(rsync(options));
}

// Clean up unnecessary files (garbage collection)
function cleanUp() {
  const dirs = [
    `${__dirname}/www/*/node_modules`,
    `${__dirname}/www/metrics`
  ];

  // Implement your garbage collection logic here using shell commands or Node.js
  console.log("Garbage Collection: Not implemented in Gulp tasks");

  return Promise.resolve();
}

// Define default task
exports.default = series(
  buildJS,
  compileCSS,
  buildHTML,
  syncAssets,
  cleanUp
);
