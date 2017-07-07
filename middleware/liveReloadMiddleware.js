
let changeWatchers = [];

function processOnChangeRequest(req, res) {
  const watchers = changeWatchers;

  watchers.push({
    req,
    res,
  });

  req.on('close', () => {
    for (let i = 0; i < watchers.length; i++) {
      if (watchers[i] && watchers[i].req === req) {
        watchers.splice(i, 1);
        break;
      }
    }
  });
}

function informChangeWatchers() {
  const watchers = changeWatchers;
  const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
  };
  watchers.forEach(function(w) {
    w.res.writeHead(205, headers);
    w.res.end(JSON.stringify({changed: true}));
  });

  changeWatchers = [];
}
module.exports = function(compiler) {
  let isInitial = false;
  compiler.plugin('done', function(stats) {
    if (isInitial) {
      informChangeWatchers(); 
    }
    isInitial = true;
  });


  // compiler.plugin('watch-run', function(stats, callback) {
  //   watchRun++;
  //   console.log('watch-run--------');
  //   console.log('watch-run--------');
  //   callback();
  // });
  return function(req, res, next) {
    if (/onchange/.test(req.url)){
      processOnChangeRequest(req, res)
      return;
    }
    next();
  }
}
