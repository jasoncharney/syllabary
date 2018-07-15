var initialized = false;
var myInst;
var socket;
var syncDisplay;

socket = io('/client');

socket.on('sync', function (msg) {
    syncDisplay = msg;
});

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initButtons();
}

///VEXFLOW

const VF = Vex.Flow;

// Create an SVG renderer and attach it to the DIV element named "boo".
var div = document.getElementById("staff");
var renderer = new VF.Renderer(div, Vex.Flow.Renderer.Backends.CANVAS);

// Configure the rendering context.
renderer.resize(window.innerWidth, window.innerHeight);

var context = renderer.getContext();

context.setFillStyle("#ffffff");

//clear notes
function clearContext() {
    context.clear();
}



var stave = new VF.Stave((window.innerWidth / 2), 0, window.innerWidth * 0.1);
stave.addClef("treble");

// Connect it to the rendering context and draw!
stave.setContext(context).draw();

var noteChoices = ["c/4", "d/4", "e/4", "f/4", "g/4", "a/4", "b/4", "c/5"];
console.log(noteChoices[0]);

var notes = [
    new VF.StaveNote({
        clef: "treble",
        keys: ["c/4", "d#/4", "eb/4"],
        duration: "w"
    })
];

var voice = new VF.Voice({
    num_beats: 4,
    beat_value: 4
});

voice.addTickables(notes)

var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);

voice.draw(context, stave);