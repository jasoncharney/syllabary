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
var tempo;
var melody;

//listens to OSC from Max, sends over websockets to client.
var oscServer = new osc.Server(connectSettings.maxSendPort, connectSettings.hostIP);
var oscClient = new osc.Client(connectSettings.hostIP, connectSettings.maxListenPort);

//send messages to display server status and initialize values (/updateClients OSC listener)
oscClient.send('serverStatus', 1);

oscServer.on('/updateClients', function (msg, rinfo) {
    var sliceNew = msg;
    sliceNew.splice(0, 1);
    roles = JSON.parse(sliceNew);
    clientUpdate();
});

oscServer.on('sync', function (msg, rinfo) {
    client.emit('sync', msg[1]);
});

oscServer.on('/melody', function (msg, rinfo) {
    var sliceNew = msg;
    sliceNew.splice(0, 1);
    console.log(sliceNew);
    melody = JSON.parse(sliceNew);
});

client.on('connection', onConnect);

function onConnect(socket) {
    //add them to array of users and send to Max.
    //When user disconnects, remove them from the array.
    var socketID = socket.id;

    connectedUsers.push(socketID);

    //client sends message in order to receive initializing information
    socket.on('initializeMe', function () {
        oscClient.send('initializeMe');
    });

    //clientUpdate();

    //send the index of client + touch status
    socket.on('touched', function (msg) {
        oscClient.send('/touched', msg);
    });
    oscServer.on('/chord', function (msg, rinfo) {
        client.emit('chord', [msg[1], msg[2], msg[3]]);
    });
    socket.on('disconnect', function () {
        connectedUsers.splice(connectedUsers.indexOf(socket.id), 1);
        //clientUpdate();
    });
}

//function for updating clients with new roles/colors upon new connection configuration.
function clientUpdate() {
    //...then reassign roles to each client.
    for (i = 0; i < connectedUsers.length; i++) {
        var sendClientNumber = connectedUsers.indexOf(connectedUsers[i]);
        client.to(connectedUsers[i]).emit('role', roles[i.toString()]);
    }
    //then update the server with info
    oscClient.send('/numberOfClients', connectedUsers.length);
}