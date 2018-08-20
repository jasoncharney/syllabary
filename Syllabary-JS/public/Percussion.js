function drawPercSetup() {
    image(blocks, width * 0.1, height * 0.2);
    image(cymbal, width * 0.3, height * 0.2);
    image(drum, width * 0.5, height * 0.2);
    image(bowl, width * 0.7, height * 0.2);
    image(glock, width * 0.9, height * 0.2);
}

function drawImplements() {
    rectMode(CENTER);
    imageMode(CENTER);
    noFill();
    stroke(255);
    strokeWeight(2);
    rect(width * 0.4, height * 0.85, height * 0.2, height * 0.2);
    rect(width * 0.6, height * 0.85, height * 0.2, height * 0.2);
    image(eval(perc.LH.implement), width * 0.4, height * 0.85);
    image(eval(perc.RH.implement), width * 0.6, height * 0.85);
}

function drawTechniques() {
    noFill();
    stroke(255);
    strokeWeight(2);
    rect(width * 0.4, height * 0.6, height * 0.2, height * 0.2);
    rect(width * 0.6, height * 0.6, height * 0.2, height * 0.2);

    fill(dynamicColor(percEnvs.LH.dynamic));
    rect(width * 0.4, height * 0.6, height * 0.2, height * 0.2);
    image(eval(perc.LH.instruction), width * 0.4, height * 0.6);

    fill(dynamicColor(percEnvs.RH.dynamic));
    rect(width * 0.6, height * 0.6, height * 0.2, height * 0.2);
    image(eval(perc.RH.instruction), width * 0.6, height * 0.6);
}

function drawInstrumentLine() {
    var leftMin = percPos[perc.LH.instrument][0];
    var leftMax = percPos[perc.LH.instrument][1];
    var rightMin = percPos[perc.RH.instrument][0];
    var rightMax = percPos[perc.RH.instrument][1];

    strokeWeight(12);

    //draw LH line
    stroke(dynamicColor(percEnvs.LH.dynamic));
    line(width * 0.4, height * 0.6, map(percEnvs.LH.pos, 0, 1, leftMin * width, leftMax * width), height * 0.2);

    //draw RH line
    stroke(dynamicColor(percEnvs.RH.dynamic));
    line(width * 0.6, height * 0.6, map(percEnvs.RH.pos, 0, 1, rightMin * width, rightMax * width), height * 0.2);
}

class PercussionNotation {
    constructor(x, y, info) {
        this.x = x;
        this.y = y;
        this.info = info;
        this.w;
        this.h;
        this.notationSize = this.h * 0.3;
    }
    boxUpdate(perc) {}
}