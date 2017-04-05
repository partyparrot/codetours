// this file is used by jest to get the proper babel presets
// it is placed here to avoid meteor to load this file.
module.exports = require('babel-jest').createTransformer({
  presets: ['es2015', 'es2016', 'react', 'stage-1'],
});
