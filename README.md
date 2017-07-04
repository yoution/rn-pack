# rn-pack

migrate from react-native packager to webpack

## Install
`npm install --save-dev rn-pack`

Usage
*  modify react-native file, `node_modules/react-native/Libraries/Performance/Systrace.js`, comment `(require: any).Systrace = Systrace` code  in the last line;
* run `node node_modules/rn-pack/index`; 

Troubleshooting
Hot load should work in debug mode
