var initialized = false;
var myInst;
var socket;
var syncDisplay;
var mode;

socket = io('/client');

socket.on('sync', function (msg) {
    syncDisplay = msg;
});
socket.on('mode', function (msg) {
    mode = msg;
});

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initButtons();
}

function draw() {
    background(0);
    if (initialized) {
        if (mode === 'syncTest') {
            syncDraw();
            gridDraw();
        }
    }
}

function syncDraw() {
    noStroke();
    fill(255);
    rectMode(CORNER);
    rect((syncDisplay - 1) * (width / 4), 0, width / 4, height * 0.33);
}

function gridDraw() {
    stroke(255);
    strokeWeight(10);
    //draw quarter notes
    for (var i = 1; i < 4; i++) {
        line((i / 4) * width, 0, (i / 4) * width, height);
    }
    strokeWeight(5);

    for (var i = 1; i < 8; i++) {
        line((i / 8) * width, 0, (i / 8) * width, height);
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}