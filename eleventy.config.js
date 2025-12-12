const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const glob = require("glob-promise");
const timeToRead = require('eleventy-plugin-time-to-read');
const htmlmin = require('html-minifier');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItOptions = {
  html: true,
  breaks: false,
  linkify: true
}
const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);

module.exports = function(eleventyConfig) {

  // ========================================
  // CONTENT PREP

  // COLLECTION FOR PHOTO GALLERY
  eleventyConfig.addCollection('gallery', async collectionApi => {
    let files = await glob('src/images/gallery/*.jpg');
    //Now filter to non thumb-
    let images = files.filter(f => {
      return f.indexOf('thumb') !== 0;
    });
    var n = 0;
    let collection = images.map(i => {
      return {
        id: 'p' + ++n,
        path: i.replace('src/images/', '/images/'),
        thumb: i.replace('src/images/gallery/', '/images/gallery/thumbs/')
      }
    });
    return collection;
  });

  // RELATED POSTS
  const getSimilarCategories = function(categoriesA, categoriesB) {
    return categoriesA.filter(Set.prototype.has, new Set(categoriesB)).length;
  };
  eleventyConfig.addLiquidFilter('similarPosts', function (collection, path, tags) {
    return collection.filter((post) => {
      return getSimilarCategories(post.data.tags, tags) >= 1 && post.data.page.inputPath !== path;
    }).sort((a,b) => {
      return getSimilarCategories(b.data.tags, tags) - getSimilarCategories(a.data.tags, tags);
    });
  });

  //Image optimization
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // which file extensions to process
    extensions: "html",

    // Add any other Image utility options here:

    urlPath: "/images/optimized/",
    outputDir: "www/images/optimized/",

    // optional, output image formats
    formats: ["webp","svg"],

    // optional, output image widths
    // widths: ["auto"],
    widths: [640,1024,1440,"auto"],

    svgShortCircuit: true,

    sharpOptions: {
      animated: true,
    },

    filenameFormat: function (id, src, width, format, options) {
      // id: hash of the original image
      // src: original image path
      // width: current width in px
      // format: current file format
      // options: set of options passed to the Image call
      let filename = src.split('/').pop().split(".")[0];
      return `${filename}-${width}.${format}`;
    },

   // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
      loading: "lazy",
      sizes: "(max-width: 768px) 640px,((min-width:768px) and (max-width:1199px)) 1024px,(min-width:1200px) 1440px",
      decoding: "async"
    },
  });

  eleventyConfig.addLiquidFilter("getOptimizedImageSrc",function (arg) {
    if (typeof arg == "undefined") return "";
    let result = "/images/optimized/";
        result += arg.split("/")
        .pop()
        .replace(/\..*/ig,'-640.webp');
        // result += "-640.webp";
    return result;
  });



  // ========================================
  // FILTERS, TRANSFORMATIONS, PROCESSING

  eleventyConfig.setLibrary('md', markdownLib);
  eleventyConfig.addPlugin(timeToRead);

  eleventyConfig.addPairedShortcode('section', (children,elementId,elementClass) => {
    let result = `<section`;
    if(elementId) result += ` id="${elementId}"`;
    if(elementClass) result += ` class="${elementClass}"`;
    result += `>${children}</section>`;
    return result;
  });

  // REGEX REPLACE FILTER
  eleventyConfig.addLiquidFilter("replace_regex",function () {
      if(typeof(arguments[0]) != "undefined") {
        return arguments[0].replace(arguments[1], arguments[2]);
      }
      return false;
    }
  );

  //MINIFY HTML
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if(outputPath.endsWith("html")) {
      // console.log('minifying: '+outputPath);
      let minified = htmlmin.minify(content, {
        useShortDoctype: true, 
        removeComments: true, 
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  //MINIFY JAVASCRIPT
  eleventyConfig.addLiquidFilter('jsmin', function (code, callback) {
    try {
      const minified = minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Minify error: ", err);
      callback(null, code);
    }
  });





  // ========================================
  // BUILD ASSETS
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addPassthroughCopy({"src/robots.txt": "/robots.txt" });
  eleventyConfig.addPassthroughCopy({"src/images/favicon/favicon.ico":"favicon.ico"});
  eleventyConfig.addPassthroughCopy({"src/images/icons":"images/icons"});

  // this rebuilds the html if the css is transpiled
  // eleventyConfig.addWatchTarget("www/css/screen.css");

  eleventyConfig.setServerOptions({
  //   // Default values are shown:
  //   // Use a local key/certificate to opt-in to local HTTP/2 with https
  //   https: {
  //     // key: "./localhost.key",
  //     // cert: "./localhost.cert",
  //   },
    port: 9999,
    showVersion: true,
    watch: ["www/css/","www/js/"],
  });

  // ========================================
  // CONFIGURATION

  return {
    dir: {
      input: "src",
      output: "www",
      // ⚠️ These values are relative to your input directory.
      includes: "_includes",
      layouts: "_layouts"
    }
  }
};
