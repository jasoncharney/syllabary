var initialized = false;
var myPart;
var socket;
var syncDisplay;

//implements
var beater, chain, hand, mallet, superball, stick, thimble, brush;
var bounce, hitcenter, hitedge, scrapetocenter, scrapetoedge, smatter, swirlccw, swirlcw;
var percSetup;

var perc, percEnvs;

var keyboard, chord;

//articulations
var sfort, staccato, marcato, slur, tenuto;

var pianoBoxes = new Array(4);
var piano0, piano1, piano2, piano3;
var pianoEnvs;

var blockBox, cymbalBox, drumBox, bowlBox, glockBox;

var tpt; // single object for holding/receiving information about trumpet from server
var tptL;
var tptR;
var tptPlay;

var pitchClass = ['a', 'A', 's', 'S', 'd', 'f', 'F', 'g', 'G', 'h', 'H', 'j'];
var trumpetPitches = ['b', 'B', 'b', 'N', 'm', 'a', 'A', 's', 'S', 'd', 'f', 'F', 'g', 'G', 'h', 'H', 'j', 'q', 'Q', 'w', 'W', 'e', 'r', 'R', 't', 'T', 'y', 'Y', 'u', '1']

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

//lines to show position on percussion instruments
var percPos = {
    'blocks': [0, 0.2],
    'cymbal': [0.2, 0.4],
    'drum': [0.4, 0.6],
    'bowl': [0.6, 0.8],
    'glock': [0.8, 1]
}

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

socket.on('maxLatency', function (msg) {
    maxLatency = msg;
    if (maxLatency > latency) {
        delayForSync = maxLatency;
    }
});

function preload() {
    loadGlyphsAndFonts();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    resizeImages();
    initButtons();
}

function draw() {
    background(0);
    stroke(strokeColor);
    if (initialized) {
        if (myPart == 'trumpet') {
            drawAir();
            drawValves();
            drawArticulation();
            tptL.notebox(tpt.airspeed);
            tptR.notebox(tpt.airspeed);
        }
        if (myPart == 'percussion') {
            drawPercSetup();
            drawInstrumentLine();
            drawImplements(myImplements);
            drawTechniques();
        }

        if (myPart == 'piano') {
            pianoDrawing();
        }
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

//LOOK: Functions that only need to happen once:


function loadGlyphsAndFonts() {
    //load fonts
    instructionFont = loadFont('fonts/Helvetica.otf');
    pitchFont = loadFont('fonts/Pitches.otf');
    notationFont = loadFont('fonts/Bravura.otf');
    //load implements
    beater = loadImage('glyphs/implements/beater.png');
    chain = loadImage('glyphs/implements/chain.png');
    hand = loadImage('glyphs/implements/hand.png');
    mallet = loadImage('glyphs/implements/mallet.png');
    superball = loadImage('glyphs/implements/superball.png');
    stick = loadImage('glyphs/implements/stick.png');
    thimble = loadImage('glyphs/implements/thimble.png');
    brush = loadImage('glyphs/implements/brush.png');

    //load instruments
    blocks = loadImage('glyphs/instruments/blocks.png');
    bowl = loadImage('glyphs/instruments/bowl.png');
    cymbal = loadImage('glyphs/instruments/cymbal.png');
    glock = loadImage('glyphs/instruments/glock.png');
    drum = loadImage('glyphs/instruments/drum.png');
    keyboard = loadImage('glyphs/keyboard.png');

    //load articulations
    sfort = loadImage('glyphs/articulations/sfort.png');
    staccato = loadImage('glyphs/articulations/staccato.png');
    tenuto = loadImage('glyphs/articulations/tenuto.png');
    marcato = loadImage('glyphs/articulations/marcato.png');
    flz = loadImage('glyphs/articulations/flz.png');
    slur = loadImage('glyphs/articulations/slur.png');

    //load techniques
    bounce = loadImage('glyphs/techniques/bounce.png');
    hitcenter = loadImage('glyphs/techniques/hitcenter.png');
    hitedge = loadImage('glyphs/techniques/hitedge.png');
    scrapetocenter = loadImage('glyphs/techniques/scrapetocenter.png');
    scrapetoedge = loadImage('glyphs/techniques/scrapetocenter.png');
    smatter = loadImage('glyphs/techniques/smatter.png');
    swirlccw = loadImage('glyphs/techniques/swirlcw.png');
    swirlcw = loadImage('glyphs/techniques/swirlcw.png');
}

function resizeImages() {
    blocks.resize(width * 0.2, 0);
    cymbal.resize(width * 0.2, 0);
    drum.resize(width * 0.2, 0);
    bowl.resize(width * 0.2, 0);
    glock.resize(width * 0.2, 0);
    beater.resize(height * 0.2, 0);
    chain.resize(height * 0.2, 0);
    hand.resize(height * 0.2, 0);
    mallet.resize(height * 0.2, 0);
    superball.resize(height * 0.2, 0);
    stick.resize(height * 0.2, 0);
    thimble.resize(height * 0.2, 0);
    brush.resize(height * 0.2, 0);
    keyboard.resize(width, height * 0.1);
    bounce.resize(height * 0.2, 0);
    hitcenter.resize(height * 0.2, 0);
    hitedge.resize(height * 0.2, 0);
    scrapetocenter.resize(height * 0.2, 0);
    scrapetoedge.resize(height * 0.2, 0);
    smatter.resize(height * 0.2, 0);
    swirlccw.resize(height * 0.2, 0);
    swirlcw.resize(height * 0.2, 0);
}

function dynamicColor(d) {
    //go from blue to red with constant value to display dynamics
    colorMode(HSB);
    var c = color(map(d, 0, 1, 233, 360), 100, 100, 100);
    colorMode(RGB);
    var clerp = lerpColor(color(0, 220), c, ease.quinticOut(d));
    return clerp;
}