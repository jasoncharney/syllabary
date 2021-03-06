function drawValves() {
    //draw background for valves
    rectMode(CENTER);
    stroke(255);
    fill(0, 100);
    strokeWeight(2);
    rect(width / 2, height / 2, height * 0.15, height * 0.5);

    //draw valves
    var valveSize = height * 0.1;

    fill(tpt.valves[0] * 255);
    ellipse(width / 2, height / 3, valveSize, valveSize);

    fill(tpt.valves[1] * 255);
    ellipse(width / 2, height / 2, valveSize, valveSize);

    fill(tpt.valves[2] * 255);
    ellipse(width / 2, height * (2 / 3), valveSize, valveSize);

    //point to the correct side to indicate what to play
    textFont(notationFont);
    textSize(height * 0.3);
    strokeWeight(4);
    fill(dynamicColor(tptEnv));
    if (tpt.play == 'R') {
        textAlign(CENTER, TOP);
        text('', width * 0.75, height * 0.5 - this.h * 0.6);
    }
    if (tpt.play == 'L') {
        textAlign(CENTER, TOP);
        text('', width * 0.25, height * 0.5 - this.h * 0.6);
    }
}

function drawArticulation() {
    fill(0);
    stroke(255);
    strokeWeight(2);
    rect(width * 0.5, height * 0.9, width * 0.1, height * 0.2);
    imageMode(CENTER);
    image(eval(tpt.articulation), width / 2, height * 0.9, height * 0.2, height * 0.2);
}

function drawAir() {
    noStroke();
    fill(dynamicColor(tptEnv));
    beginShape();
    vertex((width / 2) - tptEnv * (width * 0.05), height);
    vertex((width / 2) + tptEnv * (width * 0.05), height);
    vertex((width / 2) + tptEnv * (width * 0.15), 0);
    vertex((width / 2) - tptEnv * (width * 0.15), 0);
    endShape(CLOSE);
}

class TrumpetNotation {
    constructor(_tpt, x, y, w, h, p) {
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.p = p;
        this.notationSize = this.h * 0.3;
        this.technique; //whether this is a note display or ext. technique
        this.notes = this.stringNotes(_tpt);
    }
    stringNotes(_notes) {
        var n;
        if (typeof _notes == 'string') {
            this.technique = 'ext';
            n = _notes;
            return n; //if it's an extended technique, just return it
        } else if (typeof _notes == 'number') {
            n = trumpetPitches[_notes]; //single value will break array counting.
            this.technique = 'notes';

        } else {
            n = _notes.map(x => pitchClass[x]);
            n = str(n.join(''));
            this.technique = 'notes';
        }
        return n;
    }
    notebox(filler) {
        rectMode(CENTER);
        stroke(255);
        strokeWeight(2);
        //only fill if it's the highlighted box
        if (tpt.play == this.p) {
            fill(dynamicColor(filler));
        } else {
            noFill();
        }

        if (this.technique == 'notes') {
            textFont(pitchFont);
            textSize(this.notationSize);
            this.w = textWidth(this.notes + '&');
            rect(this.x, this.y, this.w, this.h);
            noStroke();
            fill(255);
            textAlign(CENTER, BASELINE);
            text('&' + this.notes, this.x, this.y);
        } else if (this.technique == 'ext') {
            textFont(instructionFont);
            textSize(this.notationSize * 0.5);
            rect(this.x, this.y, this.w * 0.75, this.h);
            noStroke();
            fill(255);
            textAlign(CENTER, BASELINE);
            text(this.notes, this.x, this.y);
        }
    }
}