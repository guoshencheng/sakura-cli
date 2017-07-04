import express from 'express';
import fs from 'fs';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import session from 'express-session';
var cwd = process.cwd();
var router = express.Router();
var app = express();
var http = require('http');
var htmlString = fs.readFileSync(path.resolve(__dirname, '../template/proxyServer.html'), "UTF-8");

const authInfoFromData = (data, authPath) => {
  if (authPath) {
    try {
      return authPath.reduce((key, pre) => {
        return pre[key];
      }, data)
    } catch (error) {
      return ""
    }
  } else {
    return data;
  }
}

var sakuraConfig;
try {
  sakuraConfig = require(path.resolve(cwd, "./sakura.config.json"));
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
  }
  console.log(chalk.red("Can not found sakura.config.json"))
}

const proxyHost = sakuraConfig.config.proxyHost;

var normalizePort = (val) => {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

router.all('/:appid*', (req, res, next) => {
  const appid = req.params.appid;
  const method = req.method;
  const path = req.params[0];
  const authPath = sakuraConfig.auth.path;
  const authKey = sakuraConfig.auth.key;
  const sessionInfo = req.session[appid] || {};
  axios({
    method, 
    url: proxyHost + path,
    params: Object.assign({ [authKey]: sessionInfo[authKey] }, req.query),
    data: Object.assign({ [authKey]: sessionInfo[authKey] }, req.body })
  }).then(response => {
    if (path == authPath && response.status == 200 && response.data) {
      const authInfo = {
        [sakuraConfig.auth.key]: authInfoFromData(response.data)
      }
      req.session[appid] = authInfo;
    } 
    res.status = response.status;
    res.send(response.data);
    res.end();
  }).catch(error => {
    next(error);
  })
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  name: 'SESSIONID',
  secret: 'mhc-fe',
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  resave: true,
  saveUninitialized: false,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/proxy', router);
app.use('*', (req, res, next) => {
  res.status == 200;
  res.send(htmlString);
  res.end;
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
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

module.exports = () => {
  var onListening = () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log('Sakura proxy server → Listening on: ' + bind);
  }
  var onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
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
  }
  var server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

