var percButton, pianoButton, trumpetButton;

function initButtons() {
    trumpetButton = createButton('Trumpet');
    pianoButton = createButton('Piano');
    percButton = createButton('Percussion');

    trumpetButton.position(0, 0);
    pianoButton.position(0, height / 3);
    percButton.position(0, height * (2 / 3));

    trumpetButton.mousePressed(trumpetButtonPushed);
    pianoButton.mousePressed(pianoButtonPushed);
    percButton.mousePressed(percussionButtonPushed);
}

function trumpetButtonPushed() {
    myPart = 'trumpet';
    socket.emit('player', myPart);

    pianoButton.remove();
    percButton.remove();
    trumpetButton.remove();

    socket.on('tptSettings', function (msg) {
        tpt = msg;
        //tptPlay = tpt.play;
        tptL = new TrumpetNotation(tpt.noteboxL, width * 0.25, height / 2, width * 0.25, width * 0.33);
        tptR = new TrumpetNotation(tpt.noteboxR, width * 0.75, height / 2, width * 0.25, width * 0.33);
        if (initialized == false) {
            initialized = true;
        }
    });

}

function pianoButtonPushed() {
    myPart = 'piano';
    //assign spaces for piano variables

    piano0 = new PianoNotation(height * 0.25, height / 6);
    piano1 = new PianoNotation(height * 0.45, height / 6);
    piano2 = new PianoNotation(height * 0.65, height / 6);
    piano3 = new PianoNotation(height * 0.85, height / 6);

    socket.emit('player', myPart);

    pianoButton.remove();
    percButton.remove();
    trumpetButton.remove();

    socket.on('pianoSettings', function (msg) {

        pianoBoxes = [msg.box0, msg.box1, msg.box2, msg.box3]

        if (initialized == false) {
            initialized = true;
        }
    });

    socket.on('pianoEnvs', function (msg) {
        pianoEnvs = msg;
    });
}

function percussionButtonPushed() {
    myPart = 'percussion';

    //assign spaces for percussion variables
    socket.emit('player', myPart);
    pianoButton.remove();
    percButton.remove();
    trumpetButton.remove();

    socket.on('percSettings', function (msg) {
        //myInstructions = msg.instructions;
        perc = msg;
        //myInstruments = msg.instruments;
        if (initialized == false) {
            initialized = true;
        }
    });
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function mousePressed() {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
}