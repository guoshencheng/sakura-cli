'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cwd = process.cwd();
var router = _express2.default.Router();
var app = (0, _express2.default)();
var http = require('http');
var htmlString = _fs2.default.readFileSync(_path2.default.resolve(__dirname, '../template/proxyServer.html'), "UTF-8");

var authInfoFromData = function authInfoFromData(data, authPath) {
  if (authPath) {
    try {
      return authPath.reduce(function (key, pre) {
        return pre[key];
      }, data);
    } catch (error) {
      return "";
    }
  } else {
    return data;
  }
};

var sakuraConfig;
try {
  sakuraConfig = require(_path2.default.resolve(cwd, "./sakura.config.json"));
} catch (error) {
  sakuraConfig = {
    single: true,
    config: {
      proxyHost: "http://localhost:3001",
      dingding: false,
      auth: {
        key: "sessionId",
        path: "/login.json",
        valuePath: null
      }
    }
  };
  console.log(_chalk2.default.red("Can not found sakura.config.json"));
}

var proxyHost = sakuraConfig.config.proxyHost;

var normalizePort = function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

router.all('/:appid*', function (req, res, next) {
  var appid = req.params.appid;
  var method = req.method;
  var path = req.params[0];
  var authPath = sakuraConfig.config.auth.path;
  var authKey = sakuraConfig.config.auth.key;
  var sessionInfo = req.session[appid] || {};
  (0, _axios2.default)({
    method: method,
    url: proxyHost + path,
    params: Object.assign(_defineProperty({}, authKey, sessionInfo[authKey]), req.query),
    data: Object.assign(_defineProperty({}, authKey, sessionInfo[authKey]), req.body)
  }).then(function (response) {
    if (path == authPath && response.status == 200 && response.data) {
      var authInfo = _defineProperty({}, authKey, authInfoFromData(response.data));
      req.session[appid] = authInfo;
    }
    res.status = response.status;
    res.send(response.data);
    res.end();
  }).catch(function (error) {
    next(error);
  });
});

// view engine setup
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((0, _expressSession2.default)({
  name: 'SESSIONID',
  secret: 'mhc-fe',
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000
  },
  resave: true,
  saveUninitialized: false
}));

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

app.use('/proxy', router);
app.use('*', function (req, res, next) {
  res.status == 200;
  res.send(htmlString);
  res.end;
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({
    code: err.code,
    status: err.status,
    message: err.message
  });
});

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

module.exports = function () {
  var onListening = function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Sakura proxy server → Listening on: ' + bind);
  };
  var onError = function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  var server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
};