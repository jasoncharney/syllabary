//import modules
var fs = require('fs');
var express = require('express');
var osc = require('node-osc');
var socket = require('socket.io');

//read connection settings from file (Max patch also does so I only have to update one file if IP address/ports change)
var connectSettings = JSON.parse(fs.readFileSync('./ports.json'));

//set up to serve the public directory
var app = express();
app.use(express.static('public'));
var server = app.listen(connectSettings.expressPort);
var io = socket(server);
var client = io.of('/client');

//user arrays/modes
var players = new Array();
var latencies = new Array();

var latencyMax;

//listens to OSC from Max, sends over websockets to client.
var oscServer = new osc.Server(connectSettings.maxSendPort, connectSettings.hostIP);
var oscClient = new osc.Client(connectSettings.hostIP, connectSettings.maxListenPort);

//send messages to display server status and initialize values (/updateClients OSC listener)
oscClient.send('/serverStatus', 1);

oscServer.on('/trumpet', function (msg, rinfo) {
    var slice = msg;
    slice.splice(0, 1);
    trumpet = JSON.parse(slice);
    client.to(players[0]).emit('tptSettings', trumpet);
});

oscServer.on('/percussion', function (msg) {
    var slice = msg;
    slice.splice(0, 1);
    percussion = JSON.parse(slice);
    client.to(players[2]).emit('percSettings', percussion);
});

oscServer.on('/percEnvs', function (msg) {
    var slice = msg;
    slice.splice(0, 1);
    percEnvs = JSON.parse(slice);
    client.to(players[2]).emit('percEnvs', percEnvs);
});

oscServer.on('/piano', function (msg) {
    var slice = msg;
    slice.splice(0, 1);
    piano = JSON.parse(slice);
    client.to(players[1]).emit('pianoSettings', piano);
});

oscServer.on('/pianoEnvs', function (msg) {
    var slice = msg;
    slice.splice(0, 1);
    pianoEnvs = JSON.parse(slice);
    client.to(players[1]).emit('pianoEnvs', pianoEnvs);
});
oscServer.on('/trumpetEnv', function (msg) {
    var slice = msg;
    slice.splice(0, 1);
    client.to(players[0]).emit('tptEnv', slice);

});

oscServer.on('/percSweep', function (msg) {
    var percSweep = msg;
    percSweep.splice(0, 1);
    client.to(players[2]).emit('sweep', percSweep);
});

oscServer.on('/pianoSweep', function (msg) {
    var pianoSweep = msg;
    pianoSweep.splice(0, 1);
    client.to(players[1]).emit('sweep', pianoSweep);
});

oscServer.on('/pianoLDynamic', function (msg) {
    var pianoSweep = msg[1];
    client.to(players[1]).emit('LHDynamic', pianoSweep);
});

oscServer.on('tempo', function (msg, rinfo) {
    tempo = msg[1];
    client.emit('tempo', tempo);
});

oscServer.on('getLatency', function (msg, rinfo) {
    client.emit('getLatency');
});

oscServer.on('rhythmDisplay', function (msg, rinfo) {
    client.emit('rhythmDisplay', msg[1]);
});

client.on('connection', onConnect);

function onConnect(socket) {
    //add them to array of users and send to Max.
    //When user disconnects, remove them from the array.
    var socketID = socket.id;
    client.to(socketID).emit('tempo', tempo);
    //client.to(socketID).emit('transport', transportState);
    socket.on('pi', function () {
        socket.emit('po');
    });

    socket.on('latency', function (msg) {
        calculateLatencies(msg);
        setTimeout(function () {
            socket.emit('maxLatency', latencyMax)
        }, 200);
    });

    // //client sends message in order to receive initializing information
    socket.on('player', function (msg) {
        if (msg == 'trumpet') {
            players[0] = socket.id;
            oscClient.send('/playerConnections', 'trumpet');
        }
        if (msg == 'piano') {
            players[1] = socket.id;
            oscClient.send('/playerConnections', 'piano');
        }
        if (msg == 'percussion') {
            players[2] = socket.id;
            oscClient.send('/playerConnections', 'percussion');
        }
    });

    socket.on('disconnect', function () {
        oscClient.send('/instrumentConnections', [players.indexOf(socket.id), 0]);
    });
}

function calculateLatencies(msg) {
    //var addLatency = msg;
    if (latencies.length <= 3) {
        latencies.push(msg);
    }
    latencyMax = Math.max.apply(Math, latencies);
    if (latencies.length >= 3) {
        latencies.shift();
    }
}