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
var connectedUsers = new Array();
var latencies = new Array();
var latencyMax;
var grid0;
var grid1;
var grid2;

//listens to OSC from Max, sends over websockets to client.
var oscServer = new osc.Server(connectSettings.maxSendPort, connectSettings.hostIP);
var oscClient = new osc.Client(connectSettings.hostIP, connectSettings.maxListenPort);

//send messages to display server status and initialize values (/updateClients OSC listener)
oscClient.send('/serverStatus', 1);

oscServer.on('sync', function (msg, rinfo) {
    client.emit('sync', msg[1]);
});
oscServer.on('mode', function (msg, rinfo) {
    client.emit('mode', msg[1]);
});

oscServer.on('grid8', function (msg, rinfo) {
    msg.shift();
    grid0 = msg;
    grid1 = msg.splice(0, 8);
    grid2 = msg.splice(0, 8);
    client.to(connectedUsers[0]).emit('grid8', grid0);
    client.to(connectedUsers[1]).emit('grid8', grid1);
    client.to(connectedUsers[2]).emit('grid8', grid2);
});

client.on('connection', onConnect);

function onConnect(socket) {
    //add them to array of users and send to Max.
    //When user disconnects, remove them from the array.
    var socketID = socket.id;

    socket.on('pi', function () {
        socket.emit('po');
    });

    socket.on('latency', function (msg) {
        calculateLatencies(msg)
        socket.emit('maxLatency', latencyMax);
    });

    //connectedUsers.push(socketID);
    client.to(connectedUsers[0]).emit('grid8', grid0);
    client.to(connectedUsers[1]).emit('grid8', grid1);
    client.to(connectedUsers[2]).emit('grid8', grid2);
    //client sends message in order to receive initializing information
    socket.on('instrument', function (msg) {
        if (msg == 0) {
            connectedUsers[0] = socket.id;
            oscClient.send('/instrumentConnections', [0, 1]);
        }
        if (msg == 1) {
            connectedUsers[1] = socket.id;
            oscClient.send('/instrumentConnections', [1, 1]);
        }
        if (msg == 2) {
            connectedUsers[2] = socket.id;
            oscClient.send('/instrumentConnections', [2, 1]);
        }
    });

    socket.on('disconnect', function () {
        oscClient.send('/instrumentConnections', [connectedUsers.indexOf(socket.id), 0]);
    });
}

function calculateLatencies(msg) {
    var addLatency = msg;
    if (latencies.length <= 5) {
        latencies.push(msg);
    }
    latencyMax = Math.max.apply(Math, latencies);
    if (latencies.length >= 5) {
        latencies.shift();
    }
}