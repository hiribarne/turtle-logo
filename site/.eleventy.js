module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy('assets/css');
  eleventyConfig.addPassthroughCopy('assets/js');
  eleventyConfig.addPassthroughCopy('assets/img');

  // Base path for GitHub Pages (repo name as subpath)
  const pathPrefix = process.env.PATH_PREFIX || '/turtle-logo';
  eleventyConfig.addGlobalData('base', pathPrefix);

  return {
    pathPrefix,
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '../docs',
    },
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
