const localenv = "http://localhost:8000";
const localdir = "mrbmc";
const S3BUCKET = "www.brianmcconnell.me"
const CFDISTRO = "E1TNSK7JF24IAY";
const paths = {
  js: [
    'src/_js/*.js'
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
      'src':'src/_fonts/',
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
    `${__dirname}/www/**/.DS_Store`
  ],
  caches: [
    "/",
    "/index.html",
    "/404.html",
    "/error.html",
    "/sitemap.xml",
    "/images/*",
    "/css/*",
    "/js/*",
    "/portfolio/*",
    "/blog/*",
    "/about/*",
    "/resume/*",
    "/gaia/*",
    "/colophon/*"
  ]
};




const debug = false;
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
const argv = yargs.argv;

// Compile and minify JavaScript
function buildJSPro() {
  const log = argv.verbose ? console.log : () => {};
  return src(paths.js)
    .pipe(uglify({
      mangle: true,
      compress: {
        drop_console: true
      },
      output: {
          beautify: false,
          comments: false
      }
    }))
    .on('data', file => log(`Raw ${file.path}`))
    .pipe(dest('www/js'));
}
function buildJSDev() {
  const log = argv.verbose ? console.log : () => {};
  return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      mangle: false,
      output: {
          beautify: true
      }
    }))
    .pipe(sourcemaps.write())
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

  return exec('npx @11ty/eleventy', function (err, stdout, stderr) {
        if(argv.verbose) {
          console.log(stdout);
          console.log(stderr);      
        }
      }).on('error',(err)=>{
          console.error(`Error synching assets: ${err}`);
          process.exit(1);
      });
  // return exec('npx @11ty/eleventy')
  //   .on('data', data => log(data.toString()))
  //   .on('error', (err) => {
  //     console.error(`Error building HTML: ${err}`);
  //     process.exit(1);
  //   });
}

// Sync static assets (images)
function syncAssets() {
  const log = argv.verbose ? console.log : () => {};

  //exec is much MUCH faster than calling gulp-rsync

  let foo = [];
  let command = `rsync -av #src #dst`;
      command += " --exclude='.DS_Store'";
      command += " --include='blog/*.mp4'";
      command += " --exclude='blog/*'";
      command += " --include='portfolio/**/'";
      command += " --include='portfolio/**/*.mp4'";
      command += " --exclude='portfolio/*'";
      command += " --exclude='portfolio/**/*'";

  // let optimizedImageMask = ['avif','jpg','jpeg','png','webp','gif'];
  // optimizedImageMask.forEach(ext=>{
  //   command += " --exclude='blog/*\."+ext+"'";    
  //   command += " --exclude='portfolio/*\."+ext+"'";
  //   command += " --exclude='portfolio/**/*\."+ext+"'";
  // });

  paths.assets.forEach((path)=>{
    let cmd = command
      .replace(/\#src/ig,path.src)
      .replace(/\#dst/ig,path.dst);

    if(argv.verbose) console.log(cmd);

    foo.push(
      exec(cmd, function (err, stdout, stderr) {
        if(argv.verbose) {
          console.log(stdout);
          console.log(stderr);      
        }
      }).on('error',(err)=>{
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
  return exec('blc '+localenv+' -roe > link-report.log')
    .on('error', (err) => {
      console.error(`Error checking links: ${err}`);
      process.exit(1);
    });
}

function cleanUp() {
  let r = exec('find ~/Sites/mrbmc/ -name ".DS_Store" -type f -delete')
    .on('data', (err,stdout,stderr)=> {
      log(stdout.toString());
    })
    .on('error', (err) => {
      console.error(`Error cleaning: ${err}`);
      process.exit(1);
    });
  return src(paths.garbage).pipe(clean());
}

function upload() {
  const log = argv.verbose ? console.log : () => {};
  let cmd = "aws s3 sync www s3://"+S3BUCKET+" --delete";
  if(debug) {
    cmd += " --dryrun";
    console.log(cmd);
  }
  return exec(cmd, function (err, stdout, stderr) {
    if(argv.verbose) {
      console.log(stdout);
      console.log(stderr);      
    }
  }).on('error',(err)=>{
      console.error(`Error deploying: ${err}`);
      process.exit(1);
  });
}
function uncache() {
  let cmd = "aws cloudfront create-invalidation"+(debug?" --debug":"")+" --distribution-id "+CFDISTRO+" --paths ";

  paths.caches.forEach((path)=>{
    cmd += `"`+path+`" `;
  });

  if(debug) {
    console.log(cmd);
    return true;
  }

  return exec(cmd, function (err, stdout, stderr) {
    if(argv.verbose) {
      console.log(stdout);
      console.log(stderr);      
    }
  }).on('error',(err)=>{
      console.error(`Error deploying: ${err}`);
      process.exit(1);
  })
}

exports.deploy = series(
  upload,
  uncache
);

exports.dev = series(
  buildJSDev,
  compileCSSDev,
  syncAssets,
);

// Define default task
exports.build = series(
  buildJSPro,
  compileCSSPro,
  buildHTML,
  syncAssets,
  syncBackups,
  cleanUp,
  checkLinks
);
