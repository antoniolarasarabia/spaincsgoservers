const http = require('http');
const app = require('./app');

const request = require('request');

const vmsq = require('vmsq');
var maxmind = require('maxmind');

const Gamedig = require('gamedig');


var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;


app.set('port', port);

const server = http.createServer(app);

console.log("Listen port: "+port)

server.listen(port);









