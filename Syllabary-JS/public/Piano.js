function pianoDrawing() {
    image(keyboard, 0, 0);
    piano0.boxUpdate(pianoBoxes[0]);
    piano1.boxUpdate(pianoBoxes[1]);
    piano2.boxUpdate(pianoBoxes[2]);
    piano3.boxUpdate(pianoBoxes[3]);

    piano3.notebox(pianoEnvs.env3);
    piano2.notebox(pianoEnvs.env2);
    piano1.notebox(pianoEnvs.env1);
    piano0.notebox(pianoEnvs.env0);

    piano0.rhythm(pianoBoxes[0].rhythm);
    piano0.followAction(pianoBoxes[0].follow);
    piano1.rhythm(pianoBoxes[1].rhythm);
    piano1.followAction(pianoBoxes[1].follow);
    piano2.rhythm(pianoBoxes[2].rhythm);
    piano2.followAction(pianoBoxes[2].follow);
    piano3.rhythm(pianoBoxes[3].rhythm);
    piano3.followAction(pianoBoxes[3].follow);
}

class PianoNotation {
    //must draw in corner mode
    constructor(y, h) {
        this.x;
        this.y = y;
        this.w;
        this.h = h;
        this.notes;
        this.notationSize = this.h * 0.3;
        this.chord; //TODO: figure out how to display AS A CHORD rather than the bracket bullshit
    }

    boxUpdate(pno) {
        this.x = width * pno.register;
        this.chord = pno.chord;
        this.notes = this.stringNotes(pno.notes);
    }

    //return a concatenated string from pitch classes -> notes for the pitch font.
    stringNotes(_notes) {
        var n;
        if (typeof _notes == 'number') { //single value will break array counting.
            n = pitchClass[_notes];
        } else {
            n = _notes.map(x => pitchClass[x]);
            n = str(n.join(''));
        }
        return n;
    }

    notebox(filler) {
        //draw line from box up to keyboard edge
        rectMode(CENTER);
        stroke(255);
        strokeWeight(1);
        line(this.x, this.y - (0.5 * this.h), this.x, height * 0.1);

        //draw box
        strokeWeight(2);
        fill(dynamicColor(filler));
        textSize(this.notationSize);
        textFont(pitchFont);
        this.w = textWidth(this.notes + '&');
        if (this.chord == 1) {
            strokeWeight(4);
            stroke(255, 255, 0);
        }

        rect(this.x, this.y, this.w, this.h);

        noStroke();
        fill(255);
        textAlign(CENTER, BASELINE);
        text('&' + this.notes, this.x, this.y);
    }
    //display repeat or fermata above box
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

    //display rhythm - or not? TODO: deprecate this and replace with percussion rhythm?
    rhythm(_rhythm) {
        var rhythDisplay;
        textFont(notationFont);
        textSize(this.notationSize * 0.75);
        noStroke();
        fill(255);
        textAlign(CENTER);
        if (_rhythm == 32) {
            rhythDisplay = '';
        }
        if (_rhythm == 16) {
            rhythDisplay = '';
        }
        if (_rhythm == 4) {
            rhythDisplay = '';
        }
        if (_rhythm == 8) {
            rhythDisplay = '';
        }
        if (_rhythm == 2) {
            rhythDisplay = '';
        }
        if (_rhythm == 1) {
            rhythDisplay = '';
        }
        text(rhythDisplay, this.x, this.y + (0.5 * this.h - (textAscent() * 0.4)));
    }
}