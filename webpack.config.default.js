var fs = require('fs')
var webpack = require('webpack')

var definePlugin = new webpack.DefinePlugin({
   __DEV__: JSON.stringify(true),
  'process.env': {
    NODE_ENV: JSON.stringify('development')
  }
});

let platform = process.env.PLATFORM || 'ios';

module.exports = {
    entry:{
      main: [
        // 'webpack-hot-middleware/client',
        './node_modules/react-native/packager/src/Resolver/polyfills/Object.es6.js',
        './node_modules/react-native/packager/src/Resolver/polyfills/console.js',
        './node_modules/react-native/packager/src/Resolver/polyfills/error-guard.js',
        './node_modules/react-native/packager/src/Resolver/polyfills/Number.es6.js',
        './node_modules/react-native/packager/src/Resolver/polyfills/String.prototype.es6.js',
        './node_modules/react-native/packager/src/Resolver/polyfills/Array.prototype.es6.js',
        './node_modules/react-native/packager/src/Resolver/polyfills/Array.es6.js',
        './node_modules/react-native/packager/src/Resolver/polyfills/Object.es7.js',
        './node_modules/react-native/packager/src/Resolver/polyfills/babelHelpers.js',
        "./index."+platform+ ".js",
      ],
    },
    output: {
      //hot loader require js need
      publicPath:'http://localhost:8081/',
      path: __dirname,
      filename: "index."+ platform +".bundle"
    },
    devtool: 'eval-source-map',
    // devtool: 'source-map',
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loaders: ['rn-pack-hot-loader'],
        },
        {
          test: /\.js$/,
          exclude: /(__test__|bower_components)/,
          loaders: ['babel-loader'],
        },

        {
          test: /\.(png|gif|svg)$/,
          exclude: /node_modules/,
          loaders: ['rn-pack-url-loader'],
        },
      ],
    },
  resolve:{
    modules:['node_modules'],
    alias: {
      HMRClient: __dirname + '/hotloadClient'
    },
    extensions: ['.'+ platform +'.js','.native.js','.js']
  },
  plugins:[
    definePlugin,
    new webpack.ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer:{
    publicPath: 'http://localhost:8081/',
    port: 8081,
  }
};
