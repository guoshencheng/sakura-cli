import autoprefixer from 'autoprefixer';
import path from 'path';
import webpack from 'webpack';
import paths from './paths';

const publicPath = '/';
const publicUrl = '';

const babelPlugin = [["import", [{ "style": "css", "libraryName": "antd-mobile" }]]];
const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
];

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcss: {},
    plugins: (loader) => [
      pxtorem({
        rootValue: 100,
        propWhiteList: [], // don't use propList.
      })
    ]
  }
}

const entryMiddleware = [
  require.resolve('react-dev-utils/webpackHotDevClient'),
  require.resolve('./polyfills'),
  require.resolve('react-error-overlay'),
]

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: entryMiddleware.concat([ paths.appIndexJs ])
  },
  output: {
    path: paths.appBuild,
    filename: "[name].js",
    publicPath: "/dist/"
  },
  resolve: {
    extensions: ['.web.js', '.js', '.json'],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        test: /\.(png|svg)$/i,
        loader: 'svg-sprite-loader',
        include: svgDirs,
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: false,
          presets: ['babel-preset-react-app'],
          plugins: babelPlugin
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader', postcssLoader]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader", postcssLoader]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 8192,
            name: "images/[name]-[hash].[ext]",
          },
        }],
        exclude: svgDirs
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name]-[hash].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
};
