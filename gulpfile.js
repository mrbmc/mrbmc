const { src, dest, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css'); // If you want CSS minification
const sourcemaps = require('gulp-sourcemaps');
const rsync = require('gulp-rsync');
const exec = require('child_process').exec;
const yargs = require('yargs');
const clean = require('gulp-clean');
const fsCache = require( 'gulp-fs-cache' );

// Command-line arguments parsing
const argv = yargs.argv;

// Define paths
const paths = {
  js: [
    'src/_js/*.js'
    // 'src/_js/mrbmc.js'
    // ,'src/_js/gradient.js'
    // ,'src/_js/photos.js'
    // ,'src/_js/portfolio.js'
    // ,'src/_js/gallery-inline.js'
    // ,'src/_js/boids.js'
    // ,'src/_js/boidsgl.js'
    // ,'src/_js/life.js'
    // ,'src/_js/smoke.js'
  ],
  css: [
    'src/_scss/**/!(_*).scss'
  ],
  html: ['src/**/*.md', 'src/**/*.njk'], // Eleventy source files (assuming Markdown or Nunjucks)
  assets: [
    {
      'src':'src/images/',
      'dst':'www/images'
    },
    {
      'src':'src/_fonts/LT_Univers*',
      'dst':'www/css/fonts'
    }
  ],
  backups: [
    {"src":'backup/1999/',"dst":'www/1999'},
    {"src":'backup/2000/',"dst":'www/2000'},
    {"src":'backup/2001/',"dst":'www/2001'},
    {"src":'backup/2002/',"dst":'www/2002'},
    {"src":'backup/2015/',"dst":'www/2015'},
    {"src":'backup/2022/',"dst":'www/2022'},
    {"src":'backup/2023/www/',"dst":'www/2023'}
  ],
  garbage: [
    // `${__dirname}/www/*/node_modules/**`,
    // `${__dirname}/www/metrics/**`,
    `${__dirname}/www/**/.DS_Store`
  ]
};


// Compile and minify JavaScript
function buildJSPro() {
  const log = argv.verbose ? console.log : () => {};
  return src(paths.js)
    .pipe(uglify())
    .on('data', file => log(`Raw ${file.path}`))
    .pipe(dest('www/js'));
}
function buildJSDev() {
  const log = argv.verbose ? console.log : () => {};
  return src(paths.js)
    .on('data', file => log(`Uglified ${file.path}`))
    .pipe(dest('www/js'));
}

// Compile SCSS to CSS
function compileCSSDev() {
  const log = argv.verbose ? console.log : () => {};
  return src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({format: 'beautify'}))
    .pipe(sourcemaps.write())
    .on('data', file => log(`Minified ${file.path}`))
    .pipe(dest('www/css'));
}
function compileCSSPro() {
  const log = argv.verbose ? console.log : () => {};
  return src(paths.css)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS()) // CSS minification
    .on('data', file => log(`Minified ${file.path}`))
    .pipe(dest('www/css'));
}

// Build HTML with Eleventy
function buildHTML() {
  const log = argv.verbose ? console.log : () => {};
  return exec('npx @11ty/eleventy')
    .on('data', data => log(data.toString()))
    .on('error', (err) => {
      console.error(`Error building HTML: ${err}`);
      process.exit(1);
    });
}

// Sync static assets (images)
function syncAssets() {
  const log = argv.verbose ? console.log : () => {};

  //exec is much MUCH faster than calling gulp-rsync

  let foo = [];
  let command = `rsync -av #src #dst --exclude="DS_Store"`;
  let optimizedImageMask = ['avif','jpg','jpeg','png','webp','gif'];
  optimizedImageMask.forEach(ext=>{
    command += " --exclude='blog/*\."+ext+"'";    
    command += " --exclude='portfolio/*\."+ext+"'";
    command += " --exclude='portfolio/**/*\."+ext+"'";
  });

  paths.assets.forEach((path)=>{
    let cmd = command
      .replace(/\#src/ig,path.src)
      .replace(/\#dst/ig,path.dst);

    // console.log(cmd);

    foo.push(
      exec(cmd)
        .on('data', data => log(data.toString()))
        .on('error', (err) => {
          console.error(`Error synching assets: ${err}`);
          process.exit(1);
        })
    )
  })
  return foo.pop();
}

function syncBackups() {
  const log = argv.verbose ? console.log : () => {};

  //exec is much MUCH faster than calling gulp-rsync
  let foo = [];
  let command = `rsync -av #src #dst --exclude="DS_Store"`;
   paths.backups.forEach((path)=>{
    let cmd = command
      .replace(/\#src/ig,path.src)
      .replace(/\#dst/ig,path.dst);
    // console.log(cmd);
    foo.push(
      exec(cmd)
        .on('data', data => log(data.toString()))
        .on('error', (err) => {
          console.error(`Error synching assets: ${err}`);
          process.exit(1);
        })
    )
  })
  return foo.pop();

}

function checkLinks() {
  return exec('blc http://localhost:8000 -roe > link-report.log')
    .on('error', (err) => {
      console.error(`Error checking links: ${err}`);
      process.exit(1);
    });
}

function cleanUp() {
  let r = exec('find ~/Sites/mrbmc/ -name ".DS_Store" -type f -delete')
    .on('data', data => log(data.toString()))
    .on('error', (err) => {
      console.error(`Error cleaning: ${err}`);
      process.exit(1);
    });
  return src(paths.garbage).pipe(clean());
}

exports.quick = series(
  buildJSDev,
  compileCSSDev,
  // buildHTML,
  // syncAssets,
  // syncBackups,
  // cleanUp
);

// Define default task
exports.full = series(
  buildJSPro,
  compileCSSPro,
  buildHTML,
  syncAssets,
  syncBackups,
  cleanUp,
  checkLinks
);
