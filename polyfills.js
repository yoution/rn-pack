let path = require('path');

let polyfills = [
  path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/Object.es6.js'),
  path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/console.js'),
  path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/error-guard.js'),
  path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/Number.es6.js'),
  path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/String.prototype.es6.js'),
  path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/Array.prototype.es6.js'),
  path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/Array.es6.js'),
  path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/Object.es7.js'),
  path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/babelHelpers.js'),
];

if (process.env.NODE_ENV == 'development') {
  polyfills.unshift(path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/prelude_dev.js')) 
}else {
  polyfills.unshift(path.resolve(__dirname, '../react-native/packager/src/Resolver/polyfills/prelude.js')) 
}

polyfills.push('InitializeCore');

module.exports = polyfills;
