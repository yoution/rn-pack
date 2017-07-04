
let hastemap = require('./hastemap')

hastemap(function(moduleObj) {

  require('react-native/setupBabel')()
  const path = require('path');
  const webpack = require('webpack');
  const express = require('express');
  // let config = require('../../webpack.config');
  const defaultConfig = require('./webpack.config.default');
  //middleware
  let config

  // let configObj = defaultConfig.resolve.alias
  // let configObj = defaultConfig.resolve.alias
  let defaultResolveObj = defaultConfig.resolve.alias;
  // defaultConfig.resolve.alias;
  defaultConfig.resolve.alias = Object.assign({},moduleObj,defaultResolveObj)
  config = defaultConfig;

  const hotloadmiddleware = require('webpack-hot-middleware');
  const liveReloadmiddleware = require('./liveReloadmiddleware');
  const ReactNativeServerMiddlewarePath = 'react-native/local-cli/server/middleware';
  const loadRawBodyMiddleware = require(ReactNativeServerMiddlewarePath + '/loadRawBodyMiddleware');
  const getDevToolsMiddleware = require(ReactNativeServerMiddlewarePath + '/getDevToolsMiddleware');
  const openStackFrameInEditorMiddleware = require(ReactNativeServerMiddlewarePath + '/openStackFrameInEditorMiddleware');
  const copyToClipBoardMiddleware = require(ReactNativeServerMiddlewarePath +'/copyToClipBoardMiddleware');
  const statusPageMiddleware = require(ReactNativeServerMiddlewarePath + '/statusPageMiddleware');
  const systraceProfileMiddleware = require(ReactNativeServerMiddlewarePath + '/systraceProfileMiddleware');
  const cpuProfilerMiddleware = require(ReactNativeServerMiddlewarePath + '/cpuProfilerMiddleware');
  const indexPageMiddleware = require(ReactNativeServerMiddlewarePath + '/indexPage');
  const unless = require(ReactNativeServerMiddlewarePath +'/unless');

  //util
  const ReactNativeServerUtilPath =  'react-native/local-cli/server/util';
  const InspectorProxy = require(ReactNativeServerUtilPath + '/inspectorProxy.js');
  const webSocketProxy = require(ReactNativeServerUtilPath + '/webSocketProxy.js');
  const messageSocket = require(ReactNativeServerUtilPath + '/messageSocket.js');

  const inspectorProxy = new InspectorProxy();

  var wsProxy = null;
  var ms = null;

  const app = express();
  const compiler = webpack(config);

  app.use(function(req, res, next) {

    console.log(`Using middleware for ${req.url}`);
    next();
  });
  app.use(liveReloadmiddleware(compiler));
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath
  }));



  let  args = {
    port: 8081,
    projectRoots: [path.resolve(__dirname, '../../')]
  };
  app.use(hotloadmiddleware(compiler));
  app.use(loadRawBodyMiddleware);
  app.use(getDevToolsMiddleware(args, () => wsProxy && wsProxy.isChromeConnected()))
  app.use(getDevToolsMiddleware(args, () => ms && ms.isChromeConnected()))
  app.use(openStackFrameInEditorMiddleware(args))
  app.use(copyToClipBoardMiddleware)
  app.use(statusPageMiddleware)
  app.use(systraceProfileMiddleware)
  app.use(cpuProfilerMiddleware)
  app.use(indexPageMiddleware)
  app.use(unless('/inspector', inspectorProxy.processRequest.bind(inspectorProxy)))


  let serverInstance = app.listen(8081,'127.0.0.1',function(err) {
    if (err) {
      return console.error(err);
    }

    wsProxy = webSocketProxy.attachToServer(serverInstance, '/debugger-proxy');
    ms = messageSocket.attachToServer(serverInstance, '/message');
    inspectorProxy.attachToServer(serverInstance, '/inspector');
    console.log('Listening at http://localhost:8081/');
  });
});
