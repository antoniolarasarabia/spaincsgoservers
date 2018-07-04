const http = require('http');
const app = require('./app');

const request = require('request');

const vmsq = require('vmsq');
var maxmind = require('maxmind');

const Gamedig = require('gamedig');



var port = 7171;
app.set('port', port);

const server = http.createServer(app);

console.log("Listen port: "+port)

server.listen(port);









