/**
 * Created by isaac on 16/4/21.
 */
var fs = require('fs');
var path = require('path');

module.exports = {
  key: fs.readFileSync(path.join(__dirname, './ssl.key'), 'utf8'),
  cert: fs.readFileSync(path.join(__dirname, './ssl.crt'), 'utf8')
};
