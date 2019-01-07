var http = require('http');
var yod = require('yod-mock');
var JSON = require('JSON');
var request = require('request-json');

yod.type('Admin', {
//    name       : '@Name',
    password   : '@String',
  //  mobile     : '@Tel',
    email      : '@Email'
    //wechat     : '@Tel',
    //qq         : '@Tel',
    //gender     : '@Gender',
    //avatar_url : '@Avatar',
    //birthday   : '@Date("YYYY-MM-DD", "1966-1-1","1985-1-1")',
    //comment    : '@Comment',
    //area       : '@Area',
    //zipcode    : '@Int(100000,999999)'
});

var contents = JSON.stringify(yod('@Admin.repeat(1)'));
console.log(contents);
console.log(contents.email);

var client = request.createClient('http://127.0.0.1:8080//api/admin/');
client.get('listAll.json', contents, function(err, res, body) {
    console.log(res.statusCode, body);
});
