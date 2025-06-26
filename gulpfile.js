const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rsync = require('gulp-rsync');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css'); // If you want CSS minification
const sourcemaps = require('gulp-sourcemaps');
const exec = require('child_process').exec;
const yargs = require('yargs');
const clean = require('gulp-clean');
const fsCache = require( 'gulp-fs-cache' );
const argv = yargs.argv;
const rollup = require('rollup');
const terser  = require('@rollup/plugin-terser');
const gulpif = require('gulp-if');


const localenv = "http://localhost:8000";
const localdir = "mrbmc";
const S3BUCKET = "www.brianmcconnell.me"
const CFDISTRO = "E1TNSK7JF24IAY";
const paths = {
  jsbundles: [
    {
      input: 'src/_js/mrbmc.js',
      output: 'www/js/mrbmc.bundle.js'
    },
    {
      input: 'src/_js/home.js',
      output: 'www/js/home.bundle.js'
    },
    {
      input: 'src/_js/blogpost.js', 
      output: 'www/js/blogpost.bundle.js'
    },
    {
      input: 'src/_js/portfolio.js',
      output: 'www/js/portfolio.bundle.js'
    }
  ],
  js: [
    'src/_js/gaia/*.js'
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
const dryrun = argv.dryrun || argv.debug == "dryrun";
const isProduction = argv.prod || argv.env === 'production';


async function rollupJS() {
  const log = argv.verbose ? console.log : () => {};
  const plugins = [];

  if (isProduction) {
    plugins.push(terser());
  }

  const buildPromises = paths.jsbundles.map(async (config) => {
    const bundle = await rollup.rollup({
      input: config.input,
      plugins: plugins
    });
    
    const result = await bundle.write({
      file: config.output,
      format: 'es',
      sourcemap: !isProduction
    });
    
    log(`Built ${config.output}`);
    return result;
  });

  return Promise.all(buildPromises);

}

function buildJS() {
  const log = argv.verbose ? console.log : () => {};

  return src(paths.js)
    .pipe(gulpif(!isProduction,sourcemaps.init()))
    .pipe(uglify({
      mangle: isProduction,
      compress: {
        drop_console: isProduction
      },
      output: {
          beautify: !isProduction,
          comments: !isProduction
      }
    }))
    .pipe(gulpif(!isProduction,sourcemaps.write()))
    .on('data', file => log(`Uglified ${file.path}`))
    .pipe(dest('www/js'));
}

// Compile SCSS to CSS
function compileCSS() {
  const log = argv.verbose ? console.log : () => {};
  const format = isProduction ? '' : 'beautify';
  return src(paths.css)
    .pipe(gulpif(!isProduction,sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({format: format}))
    .pipe(gulpif(!isProduction,sourcemaps.write()))
    .on('data', file => log(`Minified ${file.path}`))
    .pipe(dest('www/css'));
}

// Build HTML with Eleventy
function buildHTML() {
  const log = argv.verbose ? console.log : () => {};
  if(!isProduction) return Promise.resolve();

  return exec('npx @11ty/eleventy', function (err, stdout, stderr) {
        if(argv.verbose) {
          console.log(stdout);
          console.log(stderr);      
        }
      }).on('error',(err)=>{
          console.error(`Error synching assets: ${err}`);
          process.exit(1);
      });
}

// Sync static assets (images)
function syncAssets() {
  const log = argv.verbose ? console.log : () => {};
  if(!isProduction) return Promise.resolve();

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
  if(!isProduction) return Promise.resolve();

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
  if(!isProduction) return Promise.resolve();
  return exec('blc '+localenv+' -roe > link-report.log')
    .on('error', (err) => {
      console.error(`Error checking links: ${err}`);
      process.exit(1);
    });
}

function cleanUp() {
  if(!isProduction) return Promise.resolve();
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
  if(dryrun) {
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
  let cmd = "aws cloudfront create-invalidation"+(dryrun?" --debug":"")+" --distribution-id "+CFDISTRO+" --paths ";

  paths.caches.forEach((path)=>{
    cmd += `"`+path+`" `;
  });

  if(dryrun) {
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

// Define default task
exports.build = series(
  rollupJS,
  buildJS,
  compileCSS,
  buildHTML,
  syncAssets,
  syncBackups,
  cleanUp,
  checkLinks
);

