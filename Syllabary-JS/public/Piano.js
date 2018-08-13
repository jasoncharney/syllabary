function pianoDrawing(){
    piano0.boxUpdate(box0);
    piano1.boxUpdate(box1);
    piano2.boxUpdate(box2);
    piano3.boxUpdate(box3);

    piano3.notebox(pianoEnvs.env3);
    piano2.notebox(pianoEnvs.env2);
    piano1.notebox(pianoEnvs.env1);
    piano0.notebox(pianoEnvs.env0);

    piano0.rhythm(box0.rhythm);
    piano0.followAction(box0.follow);
    piano1.rhythm(box1.rhythm);
    piano1.followAction(box1.follow);
    piano2.rhythm(box2.rhythm);
    piano2.followAction(box2.follow);
    piano3.rhythm(box3.rhythm);
    piano3.followAction(box3.follow); 
}

class Notation {
    //must draw in corner mode
    constructor(y, h) {
        this.x;
        this.y = y;
        this.w;
        this.h = h;
        this.notes;
        this.notationSize = this.h * 0.3;
    }
    boxUpdate(pno) {
        this.x = width * pno.register;
        this.notes = this.stringNotes(pno.notes);
    }
    //return a concatenated string from pitch classes -> notes for the pitch font.
    stringNotes(_notes) {
        var n;
        if (typeof _notes == 'number') { //single value will break array counting.
            n = pitchClass[_notes];
            return n;
        } else {
            n = _notes.map(x => pitchClass[x]);
            return str(n.join(''));
        }
    }

    notebox(filler) {
        rectMode(CENTER);
        stroke(255);
        strokeWeight(0.5);
        line(this.x, this.y - (0.5 * this.h), this.x, 0);
        strokeWeight(2);
        fill(lerpColor(color('black'), color('red'), filler));
        textSize(this.notationSize);
        textFont(pitchFont);
        rect(this.x, this.y, textWidth(this.notes + '&'), this.h);

        textFont(pitchFont);
        textSize(this.notationSize);
        noStroke();
        fill(255);
        textAlign(CENTER, BASELINE);
        text('&' + this.notes, this.x, this.y) //, this.w, this.h - (textDescent() + textAscent()));
    }
    followAction(follow) {
        textSize(this.notationSize * 2);
        noStroke();
        fill(255);
        textFont(notationFont);
        var followpos = this.x + textWidth((this.notes + '&' + '   ') / 2);
        textAlign(CENTER);
        textSize(this.notationSize * 0.75);
        if (follow == 0) {
            text('', followpos, this.y - (this.h * 0.6));
        }
        if (follow == 1) {
            text(' ', followpos, this.y - (this.h * 0.5));
        }
    }
    rhythm(_rhythm) {
        var rhythDisplay;
        textFont(notationFont);
        textSize(this.notationSize * 0.75);
        noStroke();
        fill(255);
        textAlign(CENTER);
        if (_rhythm == '32n') {
            rhythDisplay = '';
        }
        if (_rhythm == '16n') {
            rhythDisplay = '';
        }
        if (_rhythm == '4n') {
            rhythDisplay = '';
        }
        if (_rhythm == '8n') {
            rhythDisplay = '';
        }
        if (_rhythm == '2n') {
            rhythDisplay = '';
        }
        text(rhythDisplay, this.x, this.y + (0.5 * this.h - (textAscent() * 0.4)));
    }



// function drawPianoNotation() {
//     //draw backgrounds for notation
//     noStroke();
//     rectMode(CORNERS);

//     fill(pianoRHandColor[0], pianoRHandColor[1], pianoRHandColor[2], 100);
//     rect(width / 2, sixthHeight + twelfthHeight, width, height - (5 * twelfthHeight));
//     fill(pianoLHandColor[0], pianoLHandColor[1], pianoLHandColor[2], LHDynamic);
//     rect(0, sixthHeight + twelfthHeight, width / 2, height - (5 * twelfthHeight));

//     //draw notation within text boxes
//     rectMode(CENTER);
//     textFont(notationFont, height * 0.1);

//     fill(strokeColor);
//     textAlign(CENTER, CENTER);
//     var notation = "&" + myNotes[0] + "+" + myNotes[1];
//     text(notation, width / 2, height / 2 - (textDescent()), textWidth(notation), height * 0.33);

// }

// function calculatePianoRegisters() {
//     //divide register markings among octaves
//     var keyWidth = width / 52;
//     dispRegisters[0] = 0;
//     dispRegisters[1] = 9 * keyWidth;
//     dispRegisters[2] = 16 * keyWidth;
//     dispRegisters[3] = 23 * keyWidth;
//     dispRegisters[4] = 30 * keyWidth;
//     dispRegisters[5] = 37 * keyWidth;
//     dispRegisters[6] = 45 * keyWidth;
//     dispRegisters[7] = width;
//     keyboard.resize(width, twelfthHeight);
//     //tintGlyphs();
// }

// function drawPianoArpAndRatios() {
//     //draw piano arp symbols
//     imageMode(CENTER);
//     //image(eval(myArp[0]), width / 3, sixthHeight, sixthHeight, sixthHeight);
//     //image(eval(myArp[1]), (width / 2 + sixthWidth), sixthHeight, sixthHeight, sixthHeight);
//     //draw ratios of notes
//     textFont(instructionFont, height * 0.15);
//     noStroke();
//     fill(strokeColor);
//     rectMode(CENTER);
//     textAlign(CENTER, BOTTOM);
//     text(myRatios[0] + ':' + myRatios[1], width * 0.5, sixthHeight + twelfthHeight);
// }

// function drawPianoRegister() {
//     //draw outline of keyboard
//     imageMode(CORNER);
//     image(eval(keyboard), 0, 0);

//     //draw octave highlights
//     rectMode(CORNERS);
//     var startCountingL = myRegisters[0];
//     var stopCountingL = myRegisters[1];
//     var startCountingR = myRegisters[2];
//     var stopCountingR = myRegisters[3];

//     //The corner points of each box are drawn.
//     stroke(pianoLHandColor[0], pianoLHandColor[1], pianoLHandColor[2], 200);
//     strokeWeight(4);
//     fill(pianoLHandColor[0], pianoLHandColor[1], pianoLHandColor[2], 100);
//     rect(dispRegisters[startCountingL], 0, dispRegisters[stopCountingL], twelfthHeight);

//     stroke(pianoRHandColor[0], pianoRHandColor[1], pianoRHandColor[2], 255);
//     strokeWeight(4);
//     fill(pianoRHandColor[0], pianoRHandColor[1], pianoRHandColor[2], 100);
//     rect(dispRegisters[startCountingR], 0, dispRegisters[stopCountingR], twelfthHeight);

    //TODO: move these labels to be under the boxes, or put a little tick to confirm where edges are
    //LH/RH labels
    // noStroke();
    // textFont(instructionFont, height * 0.05);
    // textAlign(CENTER, BOTTOM);
    // fill(pianoLHandColor[0], pianoLHandColor[1], pianoLHandColor[2], 255);
    // text('LH', 0, twelfthHeight, sixthHeight, sixthHeight);

    // fill(pianoRHandColor[0], pianoRHandColor[1], pianoRHandColor[2], 255);
    // text('RH', width - sixthWidth, twelfthHeight, sixthHeight, sixthHeight);

// }