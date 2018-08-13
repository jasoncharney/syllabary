var initialized = false;
var myPart;
var socket;
var syncDisplay;

var beater, chain, hand, mallet, superball, stick, thimble, brush;
var bell, block, scraper, bowl, cymbal, tri, chimes;

var keyboard, rolldown, rollup, shuf, pnt, chord;

var sfort;

var box0, box1, box2, box3;

var piano0, piano1, piano2, piano3;

var pianoEnvs;

var pitchClass = ['a', 'A', 's', 'S', 'd', 'f', 'F', 'g', 'G', 'h', 'H', 'j'];
//create empty variables specific to each instruments
var myImplements;
var myInstruments;
var myInstructions;
var myArp;
var myRegisters;
var myNotes;
var envelope1, envelope2;
var dispRegisters;
var myValves;
var myAirSpeed;

//colors
var strokeColor = 0;
var backgroundColor = 255;
var envColor1 = [120, 50, 255];
var envColor2 = [120, 255, 120];
var sweeperColor = [0, 0, 0];
var pianoLHandColor = [255, 0, 0];
var pianoRHandColor = [0, 0, 255];

//height/width units
var sixthHeight;
var twelfthHeight;
var sixthWidth;
var twelfthWidth;

//Fonts
var instructionFont;
var pitchFont;
var notationFont;

//Latency correction
var startTime;
var latency;
var delayForSync; //the amount to delay to compensate for latency
var maxLatency;

//Musical info from Max
var tempo;

//screen layout info
var rhythmDivider;
var phraseDuration;

var sweepPos;
var LHDynamic;

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

socket.on('timeline', function (msg) {
    sweepPos = msg;
});

//LOOK: Preload + setup
function preload() {
    loadGlyphsAndFonts();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initButtons();
    calculateSquares();
    // myInstruments = [instruments.bowl, instruments.cymbal];
    // myImplements = [implements.chain, implements.brush];
    // myInstructions = ['x', 'x'];
}

//LOOK: Draw Function

function draw() {
    background(0);
    stroke(strokeColor);
    if (initialized) {

        // stroke(255);
        // strokeWeight(2);
        // rectMode(CORNER);
        //drawEnvelope('speed/density', envelope1, envColor1);
        //drawEnvelope('volume', envelope2, envColor2);
        drawDividers(myPart);
        if (myPart == 'trumpet') {
            background(0);
            drawAir();
            drawValves();
            drawArticulation();
        }
        if (myPart == 'percussion') {
            drawPercInstruments();
        }

        if (myPart == 'piano') {
            pianoDrawing();
        }
    }
    //sweeper();
}

function drawDividers(part) {
    //Draw dividing lines that are always there
    stroke(strokeColor);
    strokeWeight(2);

    //top horizontal line
    if (part == 'percussion') {
        line(0, sixthHeight, width, sixthHeight);
    }
    if (part == 'piano') {
        line(0, sixthHeight + twelfthHeight, width, sixthHeight + twelfthHeight);
    }
    //top vertical line

    line(0, sixthHeight + (5 * twelfthHeight), width, sixthHeight + (5 * twelfthHeight));
    if (part == 'percussion') {
        line(width / 2, 0, width / 2, sixthHeight);
    }
    if (part == 'piano') {
        line(width / 2, sixthHeight + twelfthHeight, width / 2, height - (5 * twelfthHeight));
    }
    if (rhythmDivider === 'split') {
        line(width / 2, sixthHeight, width / 2, sixthHeight + (5 * twelfthHeight));
    }
}

function calculateEnvelope(env1, env2) {
    envelope1 = env1;
    envelope2 = env2;
    var envelopeHeight = 0.95 * (5 * twelfthHeight);
    var envelopeWidth = 0.98 * width;

    //calculate envelope points
    for (var i = 0; i < envelope1.length; i++) {
        if (i % 2 == 0) {
            envelope1[i] = envelope1[i] * envelopeWidth;
        }
        if (i % 2 !== 0) {
            envelope1[i] = (1 - envelope1[i]) * envelopeHeight;
        }
    }
    for (var i = 0; i < envelope2.length; i++) {
        if (i % 2 == 0) {
            envelope2[i] = envelope2[i] * envelopeWidth;
        }
        if (i % 2 !== 0) {
            envelope2[i] = (1 - envelope2[i]) * envelopeHeight;
        }
    }
}

function drawEnvelope(label, env, envColor) {
    noStroke();
    fill(envColor[0], envColor[1], envColor[2], 255);
    textFont(instructionFont, height * 0.05);
    textAlign(LEFT);
    if (env == envelope1) {
        text(label, width * 0.01, height * 2 / 3);
    }
    if (env == envelope2) {
        text(label, width * 0.01, (height * 2 / 3) - (textAscent() * 3));
    }
    stroke(envColor[0], envColor[1], envColor[2], 255);
    strokeWeight(4);
    fill(envColor[0], envColor[1], envColor[2], 50);
    push();;
    beginShape();
    translate(0, (height / 2) + twelfthHeight + height * 0.02);
    curveTightness(0.75);
    curveVertex(env[0], env[1]);
    for (var i = 0; i < env.length - 1; i += 2) {
        curveVertex(env[i], env[i + 1]);
    }
    curveVertex(env[env.length - 2], env[env.length - 1]);
    endShape(CLOSE);
    pop();
}

function sweeper() {
    noStroke();
    fill(sweeperColor[0], sweeperColor[1], sweeperColor[2], 50);
    rect(0, sixthHeight + (5 * twelfthHeight), sweepPos * width, sixthHeight + (5 * twelfthHeight));
    stroke(sweeperColor[0], sweeperColor[1], sweeperColor[2], 200);
    strokeWeight(10);
    strokeCap(SQUARE);
    line(sweepPos * width, sixthHeight + (5 * twelfthHeight), sweepPos * width, height);
}

//LOOK: Functions that only need to happen once:


function tintGlyphs() {
    keyboard.loadPixels();
    for (var x = 0; x < keyboard.width; x++) {
        for (var y = 0; y < keyboard.height; y++) {
            if (alpha(keyboard.get(x, y)) !== 0) {
                keyboard.set(x, y, color(pianoLHandColor[0], pianoLHandColor[1], pianoLHandColor[2]), 255);
            }
        }
    }
    keyboard.updatePixels();
}



function loadGlyphsAndFonts() {
    //load fonts
    instructionFont = loadFont('fonts/Helvetica.otf');
    pitchFont = loadFont('fonts/Pitches.otf');
    notationFont = loadFont('fonts/Bravura.otf');
    //PERC:
    //load implements
    beater = loadImage('glyphs/beater.png');
    chain = loadImage('glyphs/chain.png');
    hand = loadImage('glyphs/hand.png');
    mallet = loadImage('glyphs/mallet.png');
    superball = loadImage('glyphs/superball.png');
    stick = loadImage('glyphs/stick.png');
    thimble = loadImage('glyphs/thimble.png');
    brush = loadImage('glyphs/brush.png');
    //load instruments
    bell = loadImage('glyphs/bell.png');
    block = loadImage('glyphs/block.png');
    scraper = loadImage('glyphs/scraper.png');
    bowl = loadImage('glyphs/bowl.png');
    cymbal = loadImage('glyphs/cymbal.png');
    tri = loadImage('glyphs/triangle.png');
    chimes = loadImage('glyphs/chimes.png');
    //load piano
    keyboard = loadImage('glyphs/keyboard.png');
    pnt = loadImage('glyphs/pnt.png');
    chord = loadImage('glyphs/chord.png');
    rollup = loadImage('glyphs/rollup.png');
    rolldown = loadImage('glyphs/rolldown.png');
    shuff = loadImage('glyphs/shuff.png');
    //load articulations
    sfort = loadImage('glyphs/articulations/sfort.png');
}