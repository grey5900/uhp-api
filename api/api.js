import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './server';
import {mapUrl} from 'utils/url.js';
import multer from 'multer';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import mongoose from 'mongoose';
import path from 'path';
import dbConfig from './server/config';

mongoose.connect(dbConfig.db);
// require('./actions/server/utils/medicine')();

// require('./server/generators/pinyin')();

const pretty = new PrettyError();
const app = express();

const server = new http.Server(app);

const io = new SocketIo(server);
io.path('/ws');

app.use(express.static(path.join(__dirname, './uploads')));
app.use(session({
  secret: '8d31c99f-eb51-477d-b32a-e43792066729',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60000}
}));
app.use(bodyParser.json({limit: '50mb'}));

const uploadConfig = {dest: path.resolve(__dirname, './uploads/')};
app.use(multer(uploadConfig).single('file'));

app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

  const {action, params} = mapUrl(actions, splittedUrlPath);
  if (action) {
    action(req, params)
      .then((result) => {
        if (result instanceof Function) {
          result(res);
        } else {
          res.json(result);
        }
      }, (reason) => {
        const {status, redirect} = reason;
        if (status && parseInt(status / 300, 10) === 3 && redirect) {
          res.redirect(redirect);
        } else {
          console.error('API ERROR:', pretty.render(JSON.stringify(reason)), reason);
          res.status(reason.status || 500).json(reason);
        }
      });
  } else {
    res.status(404).end('NOT FOUND');
  }
});


const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  io.on('connection', (socket) => {
    socket.emit('news', {msg: `'Hello World!' from server`});

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      data.id = messageIndex;
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex++;
      io.emit('msg', data);
    });
  });
  io.listen(runnable);
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
