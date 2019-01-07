var http = require('http');
var yod = require('yod-mock');
//var JSON = require('JSON');
var request = require('request');

yod.type('Admin', {
    name       : '@Name',
    password   : '@String',
    mobile     : '@Tel',
    email      : '@Email',
    wechat     : '@Tel',
    qq         : '@Tel',
    gender     : '@Gender',
    avatar_url : '@Avatar',
    birthday   : '@Date("YYYY-MM-DD", "1966-1-1","1985-1-1")',
    comment    : '@Comment',
    area       : '@Area',
    zipcode    : '@Int(100000,999999)',
});

console.log(yod('@Admin.repeat(2)'));
var contents =yod('@Admin.repeat(1)');
console.log(contents);
var options = {
    url: 'http://localhost:8080//api/admin/register.json',
    methos: 'POST',
    json: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: contents[0]
};
function callback(error, response, data) {
    if (!error && response.statusCode == 200) {
        console.log('------info--------', data);
    }
}
request(options,callback);

//var req = http.request(options, function(res) {
//    res.setEncoding('utf8');
//    res.on('data', function (data) {
//        console.log(data);
//    });
//});
//req.write(contents);
//req.end();
