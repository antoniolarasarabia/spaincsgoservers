const express = require('express');
const router = express.Router();

const vmsq = require('vmsq');
var maxmind = require('maxmind');
const Gamedig = require('gamedig');


const stream = vmsq('hl2master.steampowered.com:27011', vmsq.EUROPE, {
    appid: 730,
    empty: 1
})
  
var servidores = [];
var servidoresFinal = [];
var servers = [];
var cityLookup;
var serverPort;
var server;
var port;
var resultado;
var infoServer;

console.log('Obteniendo lista de servidores');
obtenerServidores();


function intervalFunc() {
    console.log('Actualizando lista de servidores');
    obtenerServidores();
}
  
setInterval(intervalFunc, 300000);

function obtenerServidores(){

    const stream = vmsq('hl2master.steampowered.com:27011', vmsq.EUROPE, {
        appid: 730,
        empty: 1
    })
    serverPort = [];
    infoServer = []
    servers = [];
    servidores= [];

    
    stream.on('error', (err) => {
        console.error(err)
    })
      
    stream.on('data', (ip) => {
        servers.push(ip)
    })
      
    stream.on('end', () => {
        cityLookup = maxmind.openSync('./GeoLite2-Country.mmdb');
    
        console.log(`got ${servers.length} servers`)
        for(var i=0;i<servers.length;i++){
            serverPort = servers[i].split(":");
            server = serverPort[0];
            port = serverPort[1];
            resultado = cityLookup.get(server);
            infoServer = []
            if(resultado){
                if(resultado.country.names.en==="Spain"){
                    servidores.push(servers[i]);
    
                    Gamedig.query({
                        type: 'csgo',
                        host: server,
                        port: port
                    }).then((state) => {
                        infoServer.push(state);
    
                        if(infoServer.length === servidores.length){
                            actualizarServidores(infoServer);
                        }
                    }).catch((error) => {
                        
                    });
                }
            }
            
        }
        
    });
}

actualizarServidores = function(infoServer){
    
    var serverInfo = []
    for(var i=0; i<infoServer.length;i++){
        var servidor = {
            name: infoServer[i].name, 
            map:infoServer[i].map, 
            players:infoServer[i].raw.numplayers, 
            maxplayers:infoServer[i].maxplayers, 
            password: infoServer[i].password,
            dir: infoServer[i].query.host +':'+infoServer[i].query.port
        };
        serverInfo.push(servidor);
    }
    servidoresFinal = serverInfo;
    
}

router.get('/servidores', function(req, res) {
    res.status(200).json({
        servidoresFinal
    });
});

module.exports = router;