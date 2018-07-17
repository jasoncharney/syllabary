var initialized = false;
var myInst;
var socket;
var syncDisplay;
var mode;
var grid8;
var grid8Accents = new Array;
var articFont;
var percussionFont;

socket = io('/client');

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



function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}