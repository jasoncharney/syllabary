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

client.on('connection', onConnect);

function onConnect(socket) {
    //add them to array of users and send to Max.
    //When user disconnects, remove them from the array.
    var socketID = socket.id;

    //connectedUsers.push(socketID);

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