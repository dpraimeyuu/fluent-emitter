var pkg = require('./package.json');

var path = require('path');
var webpack = require('webpack');

var ROOT_PATH = path.resolve(__dirname);
var DIST_PATH = path.join(ROOT_PATH, 'dist');
var SRC_PATH = path.join(ROOT_PATH, 'src');

module.exports = {
  entry: path.join(SRC_PATH, 'fluent-emitter.js'),
  output: {
    path: DIST_PATH,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
        presets: ['es2015']
      },
        exclude: /node_modules/
      }
    ]
  }
};