let fs = require('fs');
var webpack = require('webpack')
let polyfills = require('./node_modules/rn-pack/polyfills');

let definePlugin = new webpack.DefinePlugin({
   __DEV__: JSON.stringify(true),
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  }
});

let platform = process.env.PLATFORM || 'ios';
let configObj = {
    entry:{
      main: [ 
        ...polyfills,
        "./index."+platform+ ".js",
      ],
    },
    output: {
      //hot loader require js need
      publicPath:'http://localhost:8081/',
      path: __dirname,
      filename: "index."+ platform +".bundle"
    },
    // devtool: 'eval-source-map',
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
      HMRClient:  'rn-pack/hotloadClient'
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

module.exports = configObj;
