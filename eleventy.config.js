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

  // COLLECTION FOR BLOG POSTS
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/blog/posts/*.md").sort(function(a,b) {
      // return a.date - b.date; // sort by date - ascending
      return b.date - a.date; // sort by date - descending
    });
  });

  // COLLECTION FOR WORK PROJECTS
  eleventyConfig.addCollection("work", function(collectionApi) {
    return collectionApi.getFilteredByTag('project').filter(item => item.data.category == "work").reverse();
  });

  eleventyConfig.addCollection("personal", function(collectionApi) {
    return collectionApi.getFilteredByTag('project').filter(item => item.data.category == "personal").reverse();
  });

  eleventyConfig.addCollection("talk", function(collectionApi) {
    return collectionApi.getFilteredByTag('project').filter(item => item.data.category == "talk").reverse();
  });

  // COLLECTION FOR PHOTO GALLERY
  eleventyConfig.addCollection('gallery', async collectionApi => {
    let files = await glob('./src/_images/gallery/*.jpg');
    //Now filter to non thumb-
    let images = files.filter(f => {
      return f.indexOf('thumb') !== 0;
    });
    var n = 0;
    let collection = images.map(i => {
      return {
        id: 'p' + ++n,
        path: i.replace('./src/_images/', '/images/'),
        thumb: i.replace('./src/_images/gallery/', '/images/gallery/thumbs/')
      }
    });
    return collection;
  });




  // ========================================
  // FILTERS, TRANSFORMATIONS, PROCESSING

  eleventyConfig.addPlugin(timeToRead);
  eleventyConfig.setLibrary('md', markdownLib);

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

  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' });
  eleventyConfig.addPassthroughCopy({"backup/2015":"2015"});
  eleventyConfig.addPassthroughCopy({"backup/2022":"2022"});
  eleventyConfig.addPassthroughCopy({"backup/2023/www":"2023"});
  eleventyConfig.addPassthroughCopy({"src/_images":"images"});
  eleventyConfig.addPassthroughCopy({"src/_fonts":"css/fonts"});
  eleventyConfig.addPassthroughCopy({"src/_images/favicon/favicon.ico":"favicon.ico"});


  eleventyConfig.setServerOptions({
  //   // Default values are shown:
  //   // Use a local key/certificate to opt-in to local HTTP/2 with https
  //   https: {
  //     // key: "./localhost.key",
  //     // cert: "./localhost.cert",
  //   },
    // port: 9999,
    showVersion: true,
    watch: ["www/css/screen.css","www/js/mrbmc.min.js"],
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
