var initialized = false;
var myPart;
var socket;
var syncDisplay;

//implements
var beater, chain, hand, mallet, superball, stick, thimble, brush;
var bounce, hitcenter, hitedge, scrapetocenter, scrapetoedge, splatter, swirlccw, swirlcw;
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
var tptEnv;

//pitch arrays. Sharps, flats.
var pitchClassF = ['a', 'ß', 's', '∂', 'd', 'f', '©', 'g', '˙', 'h', '∆', 'j'];
var pitchClassS = ['a', 'A', 's', 'S', 'd', 'f', 'F', 'g', 'G', 'h', 'H', 'j'];
var trumpetPitches = ['b', 'B', 'b', 'N', 'm', 'a', 'A', 's', 'S', 'd', 'f', 'F', 'g', 'G', 'h', 'H', 'j', 'q', 'Q', 'w', 'W', 'e', 'r', 'R', 't', 'T', 'y', 'Y', 'u', '1'];

//height/width units
var sixthHeight;
var twelfthHeight;
var sixthWidth;
var twelfthWidth;

//Fonts
var instructionFont;
var pitchFont;
var notationFont;
var chordFont;

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
    if (initialized) {
        if (myPart == 'trumpet') {
            drawAir();
            drawValves();
            drawArticulation();
            tptL.notebox(tptEnv);
            tptR.notebox(tptEnv);
        }
        if (myPart == 'percussion') {
            drawInstrumentLine();
            drawImplements();
            drawTechniques();
            drawPercSetup();
        }
        if (myPart == 'piano') {
            pianoDrawing();
        }
    }
}

//LOOK: Functions that only need to happen once:


function loadGlyphsAndFonts() {
    //load fonts
    instructionFont = loadFont('fonts/Helvetica.otf');
    pitchFont = loadFont('fonts/Pitches.otf');
    notationFont = loadFont('fonts/Bravura.otf');
    chordFont = loadFont('fonts/ChordsFont.otf');
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
    scrapetoedge = loadImage('glyphs/techniques/scrapetoedge.png');
    splatter = loadImage('glyphs/techniques/splatter.png');
    swirl = loadImage('glyphs/techniques/swirl.png');
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
    splatter.resize(height * 0.2, 0);
    swirl.resize(height * 0.2, 0);
}

function dynamicColor(d) {
    //go from blue to red with constant value to display dynamics
    colorMode(HSB);
    var c = color(map(d, 0, 1, 233, 360), 100, 100, 100);
    colorMode(RGB);
    var clerp = lerpColor(color(0, 220), c, ease.quinticOut(d));
    return clerp;
}