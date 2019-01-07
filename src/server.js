
const Express = require('express');
const React = require('react');
const ReactDOM = require('react-dom/server');
const config = require('./config');
const favicon = require('serve-favicon');
const compression = require('compression');
const httpProxy = require('http-proxy');
const path = require('path');

const createStore = require('./redux/create');
const ApiClient = require('./helpers/ApiClient');
const Html = require('./helpers/Html');
const PrettyError = require('pretty-error');
const https = require('https');

const request = require('request');
const cookieParser = require('cookie-parser');
const {match} = require('react-router');
const {syncHistoryWithStore} = require('react-router-redux');
const {ReduxAsyncConnect, loadOnServer} = require('redux-connect');
const createHistory = require('react-router/lib/createMemoryHistory');

const {Provider} = require('react-redux');
const getRoutes = require('./routes');
const generators = require('./generators');

const ServerConfig = require('../api/server/config');
const credentials = require('./sslcert');
const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new https.Server(credentials, app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: false
});
app.use(cookieParser());
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
app.use(Express.static(path.join(__dirname, '..', 'static')));

// Proxy to API server
app.use('/api', function (req, res) {
  proxy.web(req, res, {target: targetUrl});
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', function (error, req, res) {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

function handler(req, res) {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory, client);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />));
  }

  if (__DISABLE_SSR__) {
    console.log('disable server side rendering.');
    hydrateOnClient();
    return;
  }

  match({
    history,
    routes: getRoutes(store, req),
    location: req.originalUrl
  }, function (error, redirectLocation, renderProps) {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}})
        .then(function () {
          const component = (
            <Provider store={store} key="provider" >
              <ReduxAsyncConnect {...renderProps} />
            </Provider>
          );

          res.status(200);

          global.navigator = {userAgent: req.headers['user-agent']};

          res.send('<!doctype html>\n' +
            ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component}
                                          store={store} />));
        });
    } else {
      res.status(404).send('Not found');
    }
  });
}

app.get('/install', function (req, res) {
  const url = `${targetUrl}/meta/query?name=${ServerConfig.meta.installed}`;
  request({
    url: url,
    method: 'GET',
    json: true
  }, function (error, response, body) {
    const {data} = body;
    if (data && data.value) {
      res.redirect('/login');
    } else {
      return handler(req, res);
    }
  });
});

app.use(handler);

if (config.port) {
  server.listen(config.port, function (err) {
    if (err) {
      console.error(err);
    }
    generators();
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
