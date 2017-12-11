'use strict';

var errorOverlayMiddleware = require('react-error-overlay/middleware');
var noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
var config = require('./webpack.react.dev.config.js');
var paths = require('./paths');

var protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
var host = process.env.HOST || '0.0.0.0';

module.exports = function (proxy, allowedHost) {
  return {
    disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    watchContentBase: true,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    },
    https: protocol === 'https',
    host: host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true
    },
    public: allowedHost,
    proxy: proxy,
    setup: function setup(app) {
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware());
    }
  };
};