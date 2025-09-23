const { minify } = require("terser");

const getSimilarCategories = function(categoriesA, categoriesB) {
  return categoriesA.filter(Set.prototype.has, new Set(categoriesB)).length;
}

module.exports = {
  jsmin: async function (code, callback) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Minify error: ", err);
      callback(null, code);
    }
  },

  similarPosts: async function (collection, path, tags) {
    return collection.filter((post) => {
      return getSimilarCategories(post.data.tags, tags) >= 1 && post.data.page.inputPath !== path;
    }).sort((a,b) => {
      return getSimilarCategories(b.data.tags, tags) - getSimilarCategories(a.data.tags, tags);
    });
  },

};


