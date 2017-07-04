let JestHasteMap = require('jest-haste-map');
let path = require('path');
let fs = require('fs');

let haste = new JestHasteMap({
  extensions: ['js'],
  forceNodeFilesystemAPI: false,
  ignorePattern: function(filepath) {
     return filepath.indexOf('__tests__') !== -1
  },
  maxWorkers: 3,
  mocksPattern: '',
  name: 'react-native-packager-1',
  platforms: ['android', 'web', 'ios', 'windows'],
  providesModuleNodeModules: ['react-native', 'react-native-window'],
  resetCache: false,
  retainAllFiles: true,
  roots: [path.resolve(__dirname, '../..')],
  useWatchman: !true,
  watch: !true, 
})

module.exports = function(callback) {
  haste.build().then(function(data){
    var moduleMap = data.moduleMap._map;
    var resultMap = {};
    let platform = process.env.PLATFORM || 'ios'
    for(var i in moduleMap) {
      
      resultMap[i] = __dirname+'/' +
       ( moduleMap[i][platform] &&moduleMap[i][platform][0] || moduleMap[i].g[0])
    }
    // 路径格式化
    for(var i in resultMap) {
      resultMap[i]  = '/'+resultMap[i].split('//')[1]
    }
    callback(resultMap);
    return true;
  })
}
