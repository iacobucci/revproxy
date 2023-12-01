const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './revproxy.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'revproxy-bundle.js',
    libraryTarget: 'commonjs',
  },
};
