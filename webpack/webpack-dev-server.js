var Express = require('express');
var webpack = require('webpack');
var https = require('https');
var credentials = require('../src/sslcert');
var config = require('../src/config');
var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var host = config.host || 'localhost';
var port = (config.port + 1) || 3001;
var serverOptions = {
  contentBase: 'https://' + host + ':' + port,
  quiet: false,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

const server = new https.Server(credentials, app);
server.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
