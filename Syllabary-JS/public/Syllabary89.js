var initialized = false;
var myPart;
var socket;
var syncDisplay;


var beater, chain, hand, mallet, superball, stick, thimble, brush;
var bell, block, scraper, bowl, cymbal, tri, chimes;

var keyboard, rolldown, rollup, shuf, pnt, chord;

//create empty variables specific to each instruments
var myImplements;
var myInstruments;
var myInstructions;
var myArp;
var myRegisters;
var myNotes;
var envelope1, envelope2;
var dispRegisters;

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
    // myInstruments = [instruments.bowl, instruments.cymbal];
    // myImplements = [implements.chain, implements.brush];
    // myInstructions = ['x', 'x'];
}

//LOOK: Draw Function

function draw() {
    background(backgroundColor);
    stroke(strokeColor);
    if (initialized) {
        drawEnvelope('speed/density', envelope1, envColor1);
        drawEnvelope('volume', envelope2, envColor2);
        drawDividers(myPart);
        if (myPart == 'percussion') {
            drawPercInstruments();
        }

        if (myPart == 'piano') {
            drawPianoRegister();
            drawPianoArpAndRatios();
            drawPianoNotation();
        }
    }
    sweeper();
}

function displayLatency() {
    fill(255);
    noStroke();
    textSize(10);
    textFont(normalFont);
    //text('latency' + ' ' + str(latency), width * (1 / 6), height * (1 / 6));

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

function drawPercInstruments() {
    //draw instructions for both hands

    rectMode(CORNER);
    noStroke();
    textFont(instructionFont, height * 0.025);
    textAlign(CENTER, CENTER);

    //draw LH

    text(myInstructions[0], 0, 0, sixthWidth, sixthHeight);
    image(eval(myImplements[0]), sixthWidth, 0, sixthHeight, sixthHeight);
    image(eval(myInstruments[0]), sixthWidth * 2, 0, sixthHeight, sixthHeight);

    //draw RH inst/imp
    text(myInstructions[1], width / 2, 0, sixthWidth, sixthHeight);
    image(eval(myImplements[1]), sixthWidth * 4, 0, sixthHeight, sixthHeight);
    image(eval(myInstruments[1]), sixthWidth * 5, 0, sixthHeight, sixthHeight);
}

function drawPianoRegister() {
    //draw outline of keyboard
    imageMode(CORNER);
    image(eval(keyboard), 0, 0);

    //draw octave highlights
    rectMode(CORNERS);
    var startCountingL = myRegisters[0];
    var stopCountingL = myRegisters[1];
    var startCountingR = myRegisters[2];
    var stopCountingR = myRegisters[3];

    //The corner points of each box are drawn.
    stroke(pianoLHandColor[0], pianoLHandColor[1], pianoLHandColor[2], 200);
    strokeWeight(4);
    fill(pianoLHandColor[0], pianoLHandColor[1], pianoLHandColor[2], 100);
    rect(dispRegisters[startCountingL], 0, dispRegisters[stopCountingL], twelfthHeight);

    stroke(pianoRHandColor[0], pianoRHandColor[1], pianoRHandColor[2], 255);
    strokeWeight(4);
    fill(pianoRHandColor[0], pianoRHandColor[1], pianoRHandColor[2], 100);
    rect(dispRegisters[startCountingR], 0, dispRegisters[stopCountingR], twelfthHeight);

    //TODO: move these labels to be under the boxes, or put a little tick to confirm where edges are
    //LH/RH labels
    noStroke();
    textFont(instructionFont, height * 0.05);
    textAlign(CENTER, BOTTOM);
    fill(pianoLHandColor[0], pianoLHandColor[1], pianoLHandColor[2], 255);
    text('LH', 0, twelfthHeight, sixthHeight, sixthHeight);

    fill(pianoRHandColor[0], pianoRHandColor[1], pianoRHandColor[2], 255);
    text('RH', width - sixthWidth, twelfthHeight, sixthHeight, sixthHeight);

}


function drawPianoArpAndRatios() {
    //draw piano arp symbols
    imageMode(CENTER);
    image(eval(myArp[0]), width / 3, sixthHeight, sixthHeight, sixthHeight);
    image(eval(myArp[1]), (width / 2 + sixthWidth), sixthHeight, sixthHeight, sixthHeight);
    //draw ratios of notes
    textFont(instructionFont, height * 0.15);
    noStroke();
    fill(strokeColor);
    rectMode(CENTER);
    textAlign(CENTER, BOTTOM);
    text(myRatios[0] + ':' + myRatios[1], width * 0.5, sixthHeight + twelfthHeight);
}

function drawPianoNotation() {
    textFont(notationFont, height * 0.1);
    rectMode(CENTER);
    noStroke();
    fill(strokeColor);
    textAlign(CENTER, CENTER);
    //text("&" + myNotes[0] + "+" + myNotes[1], 0, sixthHeight + twelfthHeight, width, height * (2 / 3) - textAscent() + textDescent());
    var notation = "&" + myNotes[0] + "+" + myNotes[1];
    text(notation, width / 2, height / 2 - (textDescent()), textWidth(notation), height * 0.33);
    //text(myNotes[0], 0, sixthHeight + twelfthHeight, width / 2, height - (5 * twelfthHeight) - textAscent());
    //textAlign(CENTER, CENTER);
    //text(myNotes[1], width / 2, sixthHeight + twelfthHeight, width, height - (5 * twelfthHeight) - textAscent());
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
function calculatePianoRegisters() {
    //divide register markings among octaves
    var keyWidth = width / 52;
    dispRegisters[0] = 0;
    dispRegisters[1] = 9 * keyWidth;
    dispRegisters[2] = 16 * keyWidth;
    dispRegisters[3] = 23 * keyWidth;
    dispRegisters[4] = 30 * keyWidth;
    dispRegisters[5] = 37 * keyWidth;
    dispRegisters[6] = 45 * keyWidth;
    dispRegisters[7] = width;
    keyboard.resize(width, twelfthHeight);
    //tintGlyphs();
}

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


function loadGlyphs() {
    //load fonts
    instructionFont = loadFont('fonts/Helvetica.otf');
    notationFont = loadFont('fonts/Pitches.otf');
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
}