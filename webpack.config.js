var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './client/js/app.js',
  output: { path: __dirname + "/client/js", filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};
