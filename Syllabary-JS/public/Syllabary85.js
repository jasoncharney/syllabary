var initialized = false;
var myPart;
var socket;
var syncDisplay;
var mode;

var implements = {};
var instruments = {};
var beater, chain, hand, mallet, superball, stick, thimble, brush;
var bell, block, scraper, bowl, cymbal, tri, chimes;

//implements/instruments/instructions are in 2 element array (L + R hands)
var myImplements = new Array(2);
var myInstruments = new Array(2);
var myInstructions = new Array(2);

var myDisp;

//colors
var dividerColor = 0;

//height/width units
var sixthHeight;
var twelfthHeight;
var sixthWidth;
var twelfthWidth;

//Fonts
var instructionFont;

//Latency correction
var startTime;
var latency;
var delayForSync; //the amount to delay to compensate for latency
var maxLatency;

//Musical info from Max
var tempo;

//screen layout info
var rhythmSetup;
var envelopeSetup = 'single';
var phraseSetup;

var ease = new p5.Ease();

//normalized values from 0-1 are scaled in draw mode
var envelope1 = {
    'astart': 0.,
    'alength': 0.01,
    'adest': 1,
    'dlength': 0.1,
    'slevel': 0.5,
    'rlength': 0.25,
    'rdest': 0.
};
socket = io('/client');

socket.on('getLatency', function () {
    startTime = Date.now();
    socket.emit('pi');
});

socket.on('po', function () {
    latency = Date.now() - startTime;
    socket.emit('latency', latency);
});

socket.on('myID', function (msg) {
    console.log('myID');
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

socket.on('globalSetup', function (msg) {
    rhythmSetup = msg[0];
    envelopeSetup = msg[1];
});

socket.on('instimp', function (msg) {
    console.log(msg);
    myInstruments = msg.instruments;
    myImplements = msg.implements;
    myInstructions = msg.instructions;
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
// socket.on('sync', function (msg) {
//     setTimeout(function () {
//         delaySync(msg);

//     }, delayForSync);

// });

socket.on('mode', function (msg) {
    mode = msg;
});

function preload() {
    loadGlyphs();
    instructionFont = loadFont('fonts/Helvetica.otf');

    // articFont = loadFont('fonts/OpusSpecialExtraStd.otf');
    // percussionFont = loadFont('fonts/OpusPercussionStd.otf');
    // rhythmFont = loadFont('fonts/Rhythm.otf');
    //pitchFont = loadFont('fonts/Pitches.otf');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initButtons();
    sixthHeight = height * (1 / 6);
    twelfthHeight = height * (1 / 12);
    sixthWidth = width * (1 / 6);
    twelfthWidth = width * (1 / 12);
    myInstruments = [instruments.bowl, instruments.cymbal];
    myImplements = [implements.chain, implements.brush];
    myInstructions = ['x', 'x'];
}

//LOOK: Draw Function

function draw() {
    background(255);
    stroke(0);
    drawEnvelopes();
    if (initialized) {
        drawDividers(rhythmSetup, envelopeSetup, phraseSetup);
        //drawInstruments(myInstruments, myImplements, myInstructions);
    }
}

function displayLatency() {
    fill(255);
    noStroke();
    textSize(10);
    textFont(normalFont);
    //text('latency' + ' ' + str(latency), width * (1 / 6), height * (1 / 6));

}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    sixthHeight = height * (1 / 6);
    twelfthHeight = height * (1 / 12);
    sixthWidth = width * (1 / 6);
    twelfthWidth = width * (1 / 12);
}

function mousePressed() {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
}

function loadGlyphs() {
    //load implements into implement object
    beater = loadImage('glyphs/beater.png');
    chain = loadImage('glyphs/chain.png');
    hand = loadImage('glyphs/hand.png');
    mallet = loadImage('glyphs/mallet.png');
    superball = loadImage('glyphs/superball.png');
    stick = loadImage('glyphs/stick.png');
    thimble = loadImage('glyphs/thimble.png');
    brush = loadImage('glyphs/brush.png');
    //load instruments into instrument object
    bell = loadImage('glyphs/bell.png');
    block = loadImage('glyphs/block.png');
    scraper = loadImage('glyphs/scraper.png');
    bowl = loadImage('glyphs/bowl.png');
    cymbal = loadImage('glyphs/cymbal.png');
    tri = loadImage('glyphs/triangle.png');
    chimes = loadImage('glyphs/chimes.png');
}

function drawDividers(_rhythm, _envelope, _phrases) {
    //Draw dividing lines that are always there
    stroke(dividerColor);
    strokeWeight(2);

    line(0, sixthHeight, width, sixthHeight);
    line(0, sixthHeight + (5 * twelfthHeight), width, sixthHeight + (5 * twelfthHeight));
    line(width / 2, 0, width / 2, sixthHeight);
    if (_rhythm === 'split') {
        stroke(dividerColor);
        strokeWeight(2);
        line(width / 2, sixthHeight, width / 2, sixthHeight + (5 * twelfthHeight));
    }
    if (_envelope === 'split') {
        stroke(dividerColor);
        strokeWeight(2);
        line(width / 2, sixthHeight + (5 * twelfthHeight), width / 2, height);
    }
}

function drawInstruments(_instrument, _implement, _instruction) {
    image(_instrument[0], 0, 0, sixthWidth, sixthHeight);
    image(_instrument[1], width / 2, 0, sixthWidth, sixthHeight);
    image(_implement[0], sixthWidth, 0, sixthWidth, sixthHeight);
    image(_implement[1], sixthWidth * 4, 0, sixthWidth, sixthHeight);
    textFont(instructionFont, height * 0.05);
    textAlign(CENTER, CENTER);
    text(_instruction, sixthWidth * 2, 0, sixthWidth, sixthHeight);
}

function drawEnvelopes() {
    stroke(0);
    strokeWeight(2);
    fill(0, 20);
    var envelopeHeight = 0.95 * (5 * twelfthHeight);

    var envelopeWidth;

    if (envelopeSetup === 'single') {
        envelopeWidth = 0.98 * width;
    }
    if (envelopeSetup === 'split') {
        envelopeWidth = 0.48 * width;
    }
    var envelope1slength = 1 - (envelope1.alength + envelope1.dlength + envelope1.rlength);
    push();
    translate(0.001 * width, height * 0.99 - envelopeHeight);
    beginShape();
    //curve tightness from 0-1
    curveTightness(0.75);
    var avert = [0, (1 - envelope1.astart)];
    var maxvert = [envelope1.alength, (1 - envelope1.adest)];
    var dvert = [maxvert[0] + envelope1.dlength, (1 - envelope1.slevel)];
    var rvert = [1., (1 - envelope1.rdest)];
    var sendvert = [1. - envelope1slength, envelope1.slevel];
    curveVertex(avert[0], avert[1] * envelopeHeight);
    curveVertex(avert[0], avert[1] * envelopeHeight);

    //Max level vertex
    curveVertex(maxvert[0] * envelopeWidth, maxvert[1] * envelopeHeight);
    //decay line: x position is added to x position of the max level vertex
    curveVertex(dvert[0] * envelopeWidth, dvert[1] * envelopeHeight);
    //sustain line: calculated 
    curveVertex(sendvert[0] * envelopeWidth, sendvert[1] * envelopeHeight);
    //final point
    curveVertex(rvert[0] * envelopeWidth, rvert[1] * envelopeHeight);
    curveVertex(envelopeWidth, rvert[1] * envelopeHeight);
    endShape(CLOSE);
    pop();
}