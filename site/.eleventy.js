module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy('assets/css');
  eleventyConfig.addPassthroughCopy('assets/js');
  eleventyConfig.addPassthroughCopy('assets/img');

  return {
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
