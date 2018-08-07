2var initialized = false;
var myInst;
var socket;
var syncDisplay;
var mode;
//var grid8;
//var grid8Accents = new Array;

//Fonts
var articFont;
var percussionFont;

//Latency correction
var startTime;
var latency;
var delayForSync; //the amount to delay to compensate for latency
var maxLatency;

//Musical info from Max
var tempo;
var beat;
var beatProgress;
var rhythm = 'r';
var pitches = '&©eafafafaaffffa';
var metroPos = 0.5;
var metroInc = 0.01;
var oscTest = new Tone.LFO(0.1, -1, 1).start();
var conduct = new Tone.Signal();
oscTest.chain(conduct);
var conductValue = conduct.value;


//Tone.Master.mute = true;
//prephit.connect(oscTest.frequency);

var ease = new p5.Ease();

Tone.Transport.loop = false;
Tone.Transport.loopStart = 0;
Tone.Transport.loopEnd = '4n';

socket = io('/client');

var metroLoop = new Tone.Loop(sweeper, '4n').start(0);
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
        setTimeout(startTimeline, delayForSync);
    }
    if (msg == 0) {
        Tone.Transport.stop();
    }
});

function startTimeline() {
    Tone.Transport.start();
    metroPos = 0.5;
}

socket.on('prepAndHit', function () {
    prephit.value = 0.;
    prephit.rampTo(1, '2n');
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

socket.on('rhythmDisplay', function (msg) {
    rhythm = msg;
    console.log(rhythm);
});

function preload() {
    articFont = loadFont('fonts/OpusSpecialExtraStd.otf');
    percussionFont = loadFont('fonts/OpusPercussionStd.otf');
    rhythmFont = loadFont('fonts/Rhythm.otf');
    normalFont = loadFont('fonts/Helvetica.otf');
    //pitchFont = loadFont('fonts/Pitches.otf');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initButtons();
}


function draw() {
    //console.log(Tone.Time().toBarsBeatsSixteenths());
    //console.log(oscTest.frequency.value);
    beat = Tone.TransportTime().toBarsBeatsSixteenths().split(':')[1];
    //console.log(oscTest.value);
    //beatProgress = (Tone.TransportTime().toTicks() % 192) / 192;
    background(0);


    //rhythmDisplay(rhythm);
    //pitchDisplay(pitches);

    //console.log(prephit.value);
    //console.log(Tone.context.state);
    //prepAndDown();
    if (initialized) {
        rhythmBox(1, rhythm);
        rhythmBox(2, rhythm);
        pitchBox(1, pitches);
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
}
//     // if (initialized == false) {
//     //     initialized = true;
//     // }
// }


// function prepAndDown() {
//     fill(255);
//     var movePrephit = ease.circularInOut(oscTest.value);
//     rect(0, movePrephit * height, width, 0.1 * height);
// }

function sweeper() {
    metroInc = -metroInc;
}

function metronome() {
    fill(255);
    rectMode(CORNER);
    metroPos += metroInc;
    rect(metroPos * width / 2, 0, 10, 200);
}

//Rhythm box
function rhythmBox(rhythmID, rhythmType) {
    this.rhythmID = rhythmID;
    this.rhythmType = rhythmType;

    this.pos = new Array(2);

    if (this.rhythmID == 1) {
        this.pos = [0, height * 0.5]
    }

    if (this.rhythmID == 2) {
        this.pos = [width * 0.5, height * 0.5]
    }

    //background
    fill(255);
    stroke(120);
    strokeWeight(2);
    rectMode(CORNER);
    rect(this.pos[0], this.pos[1], width * 0.5, height * 0.25);

    //rhythmDisplay
    noStroke();
    fill(0);
    textFont(rhythmFont);
    textSize(100);
    textAlign(CENTER);
    rectMode(CORNER);
    text(this.rhythmType, this.pos[0], this.pos[1], width * 0.5, height * 0.25);
}

function pitchBox(pitchID, _pitch) {
    this.pitchID = pitchID;
    this.pitches = _pitch;

    this.pos = new Array(2);
    if (this.pitchID == 1) {
        this.pos = [0, 0]
    }

    if (this.pitchID == 2) {
        this.pos = [width * 0.5, 0]
    }

    //background box
    fill(255);
    stroke(120);
    strokeWeight(2);
    rectMode(CORNER);
    rect(this.pos[0], this.pos[1], width * 0.5, height * 0.5);

    noStroke();
    fill(0);

    rectMode(CORNER);
    textFont('pitchFont', 50);

    this.fontSize = constrain(textWidth(this.pitches), 20, width * 0.04);
    textSize(this.fontSize);
    console.log(this.fontSize);
    textAlign(CENTER, CENTER);

    text(this.pitches, this.pos[0], this.pos[1], width * 0.5, height * 0.25);

}