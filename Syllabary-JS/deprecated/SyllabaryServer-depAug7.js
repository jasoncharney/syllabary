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
var tempo;
var transportState;

//listens to OSC from Max, sends over websockets to client.
var oscServer = new osc.Server(connectSettings.maxSendPort, connectSettings.hostIP);
var oscClient = new osc.Client(connectSettings.hostIP, connectSettings.maxListenPort);

//send messages to display server status and initialize values (/updateClients OSC listener)
oscClient.send('/serverStatus', 1);

// oscServer.on('sync', function (msg, rinfo) {
//     client.emit('sync', msg[1]);
// });
oscServer.on('mode', function (msg, rinfo) {
    mode = msg[1];
    client.emit('mode', mode);
});

oscServer.on('/dividers', function (msg, rinfo) {
    var slice = msg;
    slice.splice(0, 1);
    var dividers = JSON.parse(slice);
    client.to(players[0]).emit('dividers', dividers.player0);
    client.to(players[1]).emit('dividers', dividers.player1);
    client.to(players[2]).emit('dividers', dividers.player2);
});

oscServer.on('/instimp', function (msg, rinfo) {
    var slice = msg;
    slice.splice(0, 1);
    var instimp = JSON.parse(slice);
    client.to(players[0]).emit('instimp', instimp.player0);
    client.to(players[1]).emit('instimp', instimp.player1);
    client.to(players[2]).emit('instimp', instimp.player2);
});

oscServer.on('/envelopes', function (msg, rinfo) {
    var slice = msg;
    slice.splice(0, 1);
    var envelopes = JSON.parse(slice);
    client.to(players[0]).emit('envelopes', envelopes.player0);
    client.to(players[1]).emit('instimp', envelopes.player1);
    client.to(players[2]).emit('instimp', envelopes.player2);
});

oscServer.on('tempo', function (msg, rinfo) {
    tempo = msg[1];
    client.emit('tempo', tempo);
});

oscServer.on('transport', function (msg, rinfo) {
    transportState = msg[1];
    client.emit('transport', transportState);
});

oscServer.on('getLatency', function (msg, rinfo) {
    client.emit('getLatency');
});

oscServer.on('prepAndHit', function (msg, rinfo) {
    client.emit('prepAndHit');
});

oscServer.on('rhythmDisplay', function (msg, rinfo) {
    client.emit('rhythmDisplay', msg[1]);
});


oscServer.on('grid8', function (msg, rinfo) {
    msg.shift();
    grid0 = msg;
    grid1 = msg.splice(0, 8);
    grid2 = msg.splice(0, 8);
    client.to(players[0]).emit('grid8', grid0);
    client.to(players[1]).emit('grid8', grid1);
    client.to(players[2]).emit('grid8', grid2);
});

oscServer.on('envelope1', function (msg, rinfo) {

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
        calculateLatencies(msg)
        //TODO: fix it so that max latencies are emitted only after 3 have
        //been received
        setTimeout(function () {
            socket.emit('maxLatency', latencyMax)
        }, 200);
    });

    // //client sends message in order to receive initializing information
    socket.on('player', function (msg) {
        if (msg == 0) {
            players[0] = socket.id;
            oscClient.send('/playerConnections', [0, 1]);
        }
        if (msg == 1) {
            players[1] = socket.id;
            oscClient.send('/playerConnections', [1, 1]);
        }
        if (msg == 2) {
            players[2] = socket.id;
            oscClient.send('/playerConnections', [2, 1]);
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