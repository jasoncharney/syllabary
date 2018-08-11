var player2Button, player1Button, player0Button;

function initButtons() {
    player0Button = createButton('Trumpet');
    player1Button = createButton('Piano');
    player2Button = createButton('Percussion');

    player0Button.position(0, 0);
    player1Button.position(0, height / 3);
    player2Button.position(0, height * (2 / 3));

    player0Button.mousePressed(player0ButtonPushed);
    player1Button.mousePressed(player1ButtonPushed);
    player2Button.mousePressed(player2ButtonPushed);
}

function player0ButtonPushed() {
    myPart = 'trumpet';
    socket.emit('player', myPart);
    initialized = true;
    player1Button.remove();
    player2Button.remove();
    player0Button.remove();
    calculateSquares();
    socket.on('tptSettings', function (msg) {
        intialized = true;
        calculateEnvelope(msg.envelope);
        myInstructions = msg.instructions;
        myImplements = msg.implements;
        myInstruments = msg.instruments;
    });

}

function player1ButtonPushed() {
    myPart = 'piano';
    //assign spaces for piano variables
    myArp = new Array(2);
    myRegisters = new Array(4);
    myRatios = new Array(2);
    dispRegisters = new Array(8);

    socket.emit('player', myPart);

    player1Button.remove();
    player2Button.remove();
    player0Button.remove();
    calculateSquares();
    socket.on('pianoSettings', function (msg) {
        calculateEnvelope(msg.envelope1, msg.envelope2);
        myRegisters = msg.registers;
        myArp = msg.arp;
        myRatios = msg.ratio;
        myNotes = [msg.notesL, msg.notesR];
        if (initialized == false) {
            calculatePianoRegisters();
            initialized = true;
        }
        console.log(keyboard.get(0, 0));
    });
    socket.on('sweep', function (msg) {
        sweepPos = msg;
    });

}

function player2ButtonPushed() {
    myPart = 'percussion';
    //assign spaces for percussion variables
    myImplements = new Array(2);
    myInstructions = new Array(2);
    myInstruments = new Array(2);
    socket.emit('player', myPart);
    player1Button.remove();
    player2Button.remove();
    player0Button.remove();
    calculateSquares();

    socket.on('percSettings', function (msg) {
        calculateEnvelope(msg.envelope1, msg.envelope2);
        myInstructions = msg.instructions;
        myImplements = msg.implements;
        myInstruments = msg.instruments;
        if (initialized == false) {
            initialized = true;
        }
    });
    socket.on('sweep', function (msg) {
        sweepPos = msg;
    });

}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
    calculateSquares();
    // calculateEnvelopes();
}

function mousePressed() {
    if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
}

function calculateSquares() {
    sixthHeight = height * (1 / 6);
    twelfthHeight = height * (1 / 12);
    sixthWidth = width * (1 / 6);
    twelfthWidth = width * (1 / 12);
}