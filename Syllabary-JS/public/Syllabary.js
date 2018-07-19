var initialized = false;
var myInst;
var socket;
var syncDisplay;
var mode;
var grid8;
var grid8Accents = new Array;
var articFont;
var percussionFont;
var startTime;
var latency;
var delayForSync = 1; //the amount to delay to compensate for latency
var maxLatency;

socket = io('/client');

setInterval(function () {
    startTime = Date.now();
    socket.emit('pi');
}, 2000);

socket.on('po', function () {
    latency = Date.now() - startTime;
    socket.emit('latency', latency);
});

socket.on('maxLatency', function (msg) {
    maxLatency = msg;
    if (msg < latency) {
        delayForSync = maxLatency - latency;
    }
});

socket.on('sync', function (msg) {
    syncDisplay = msg;
});

socket.on('mode', function (msg) {
    mode = msg;
});

socket.on('grid8', function (msg) {
    grid8 = msg;
    grid8Accents = new Array();
    for (var i = 0; i < grid8.length; i++) {
        if (grid8[i] == 1) {
            var accentOrNot = Math.random();
            if (accentOrNot > 0.8) {
                grid8Accents[i] = 1;
            }
        }
    }
});

function preload() {
    articFont = loadFont('fonts/OpusSpecialExtraStd.otf');
    percussionFont = loadFont('fonts/OpusPercussionStd.otf');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initButtons();
}

function draw() {
    background(0);
    displayLatency();
    if (initialized) {
        if (mode === 'syncTest') {
            syncDraw();
            grid8Draw();
            gridDraw();
        }
        if (mode === 'passAround') {
            splitBG();
            PercTechnique('bow', width / 6, height / 2);
            PercTechnique('mallet', width * 0.833, height / 2);
            //percussion: pass these as objects:
            //LHimp, RHimp
            //LHinst, RHinst
            //LHNote, RHNote
        }
    }
}

function displayLatency() {
    fill(255);
    noStroke();
    textSize(10);
    setTimeout(latencyText, delayForSync); // won't work in draw (every frame)
}

function latencyText() {
    text('latency' + ' ' + str(latency), width / 2, height - 10);
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}