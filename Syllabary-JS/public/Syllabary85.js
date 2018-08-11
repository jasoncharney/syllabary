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

var envelope1 = [0., 0., 0.281915, 0.853333, 0.43617, 0.213333, 0.75, 0.173333, 1., 0.];
var envelope2;

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
var rhythmDivider;
var envelopeDivider;
var phraseDuration;

var envPos;

var ease = new p5.Ease();

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

socket.on('dividers', function (msg) {
    rhythmDivider = msg.rhythms;
    envelopeDivider = msg.envelopes;
    phraseDuration = msg.phraseduration;
});

socket.on('instimp', function (msg) {
    myInstruments = msg.instruments;
    myImplements = msg.implements;
    myInstructions = msg.instructions;
});

socket.on('envelopes', function (msg) {
    calculateEnvelopes(msg.envelope1, msg.envelope2);
});

socket.on('timeline', function (msg) {
    envPos = msg;
});

function calculateEnvelopes(env1, env2) {
    envelope1 = env1;
    envelope2 = env2;

    var envelopeHeight = 0.95 * (5 * twelfthHeight);
    var envelopeWidth;

    if (envelopeDivider === 'single') {
        envelopeWidth = 0.98 * width;
    } else if (envelopeDivider === 'split') {
        envelopeWidth = 0.48 * width;
    }
    //calculate envelope1 points
    for (var i = 0; i < envelope1.length; i++) {
        if (i % 2 == 0) {
            envelope1[i] = envelope1[i] * envelopeWidth;
        }
        if (i % 2 !== 0) {
            envelope1[i] = (1 - envelope1[i]) * envelopeHeight;
        }
    }
    //calculate envelope2 points if split.
    if (envelopeDivider === 'split') {
        for (var i = 0; i < envelope2.length; i++) {
            if (i % 2 == 0) {
                envelope2[i] = envelope2[i] * envelopeWidth;
            }
            if (i % 2 !== 0) {
                envelope2[i] = (1 - envelope2[i]) * envelopeHeight;
            }
        }
    }
}

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


//LOOK: Preload + setup
function preload() {
    loadGlyphs();
    instructionFont = loadFont('fonts/Helvetica.otf');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initButtons();
    calculateSquares();
    myInstruments = [instruments.bowl, instruments.cymbal];
    myImplements = [implements.chain, implements.brush];
    myInstructions = ['x', 'x'];
}

//LOOK: Draw Function

function draw() {
    background(255);
    stroke(0);
    //drawEnvelopes();
    if (initialized) {
        drawDividers();
        drawInstruments();
        drawEnvelopes();
        envelopeSweeper();
    }
}

function displayLatency() {
    fill(255);
    noStroke();
    textSize(10);
    textFont(normalFont);
    //text('latency' + ' ' + str(latency), width * (1 / 6), height * (1 / 6));

}


function drawDividers() {
    //Draw dividing lines that are always there
    stroke(dividerColor);
    strokeWeight(2);

    line(0, sixthHeight, width, sixthHeight);
    line(0, sixthHeight + (5 * twelfthHeight), width, sixthHeight + (5 * twelfthHeight));
    line(width / 2, 0, width / 2, sixthHeight);
    if (rhythmDivider === 'split') {
        stroke(dividerColor);
        strokeWeight(2);
        line(width / 2, sixthHeight, width / 2, sixthHeight + (5 * twelfthHeight));
    }
    if (envelopeDivider === 'split') {
        stroke(dividerColor);
        strokeWeight(2);
        line(width / 2, sixthHeight + (5 * twelfthHeight), width / 2, height);
    }
}

function drawInstruments() {
    //draw instructions for both hands
    noStroke();
    textFont(instructionFont, height * 0.025);
    textAlign(CENTER, CENTER);

    //draw LH
    text(myInstructions[0], 0, 0, sixthWidth, sixthWidth);
    image(eval(myImplements[0]), sixthWidth, 0, sixthWidth, sixthWidth);
    image(eval(myInstruments[0]), sixthWidth * 2, 0, sixthWidth, sixthWidth);

    //draw RH inst/imp
    text(myInstructions[1], width / 2, 0, sixthWidth, sixthWidth);
    image(eval(myImplements[1]), sixthWidth * 4, 0, sixthWidth, sixthWidth);
    image(eval(myInstruments[1]), sixthWidth * 5, 0, sixthWidth, sixthWidth);


}

function drawEnvelopes() {
    noStroke();
    fill(255, 0, 0, 255);
    push();;
    beginShape();
    translate(0, (height / 2) + sixthHeight);
    curveTightness(0.75);
    curveVertex(envelope1[0], envelope1[1]);
    curveVertex(envelope1[0], envelope1[1]);
    curveVertex(envelope1[2], envelope1[3]);
    curveVertex(envelope1[4], envelope1[5]);
    curveVertex(envelope1[6], envelope1[7]);
    curveVertex(envelope1[8], envelope1[9]);
    curveVertex(envelope1[8], envelope1[9]);
    endShape();
    pop();
}

function envelopeSweeper() {
    noStroke();
    fill(255, 0, 0, 100);
    rect(0, sixthHeight + (5 * twelfthHeight), envPos * width, sixthHeight + (5 * twelfthHeight));
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