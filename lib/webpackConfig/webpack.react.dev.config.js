'use strict';

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _paths = require('./paths');

var _paths2 = _interopRequireDefault(_paths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var publicPath = '/';
var publicUrl = '';

var babelPlugin = [["import", [{ "style": "css", "libraryName": "antd-mobile" }]]];
var svgDirs = [require.resolve('antd-mobile').replace(/warn\.js$/, '')];

var postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcss: {},
    plugins: function plugins(loader) {
      return [pxtorem({
        rootValue: 100,
        propWhiteList: [] // don't use propList.
      })];
    }
  }
};

var entryMiddleware = [require.resolve('react-dev-utils/webpackHotDevClient'), require.resolve('./polyfills'), require.resolve('react-error-overlay')];

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: entryMiddleware.concat([_paths2.default.appIndexJs])
  },
  output: {
    path: _paths2.default.appBuild,
    filename: "[name].js",
    publicPath: "/dist/"
  },
  resolve: {
    extensions: ['.web.js', '.js', '.json']
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [{
      test: /\.(png|svg)$/i,
      loader: 'svg-sprite-loader',
      include: svgDirs
    }, {
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        babelrc: false,
        presets: ['babel-preset-react-app'],
        plugins: babelPlugin
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', postcssLoader]
    }, {
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader", postcssLoader]
    }, {
      test: /\.(png|jpe?g|gif|svg)$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "images/[name]-[hash].[ext]"
        }
      }],
      exclude: svgDirs
    }, {
      test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader?name=fonts/[name]-[hash].[ext]'
    }]
  },
  plugins: [new _webpack2.default.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  }), new _webpack2.default.HotModuleReplacementPlugin()]
};