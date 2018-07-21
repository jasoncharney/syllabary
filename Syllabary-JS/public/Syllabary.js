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
var delayForSync; //the amount to delay to compensate for latency
var maxLatency;
var tempo;
var beat;
var beatProgress;

socket = io('/client');

// setInterval(function () {
//     startTime = Date.now();
//     socket.emit('pi');
// }, 2000);

socket.on('getLatency', function () {
    startTime = Date.now();
    socket.emit('pi');
});

socket.on('po', function () {
    latency = Date.now() - startTime;
    socket.emit('latency', latency);
});

socket.on('tempo', function (msg) {
    tempo = msg;
    Tone.Transport.bpm.value = tempo;
});

socket.on('maxLatency', function (msg) {
    maxLatency = msg;
    if (maxLatency > latency) {
        delayForSync = maxLatency;
    }
});

socket.on('transport', function (msg) {
    if (msg == 1) {
        setTimeout(Tone.Transport.start(), delayForSync);
    }
    if (msg == 0) {
        Tone.Transport.stop();
    }
});

// socket.on('sync', function (msg) {
//     setTimeout(function () {
//         delaySync(msg);

//     }, delayForSync);

// });

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
    normalFont = loadFont('fonts/Helvetica.otf');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initButtons();
}

function draw() {
    //console.log(Tone.Time().toBarsBeatsSixteenths());
    beat = Tone.TransportTime().toBarsBeatsSixteenths().split(':')[1];
    beatProgress = (Tone.TransportTime().toTicks() % 192) / 192;
    background(0);
    displayLatency();
    //prepAndDown();
    if (initialized) {
        if (mode === 'eightGrid') {
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
    textFont(normalFont);
    text('latency' + ' ' + str(latency), width / 2, height - 10);

}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function mousePressed() {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }

    //     if (initialized == false) {
    //         initialized = true;
    //     }
}

function prepAndDown() {
    fill(255);
    rect(0, beatProgress * height, width, 0.1 * height);
}