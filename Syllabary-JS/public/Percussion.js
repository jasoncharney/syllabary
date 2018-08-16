function drawPercSetup() {
    imageMode(CENTER);
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
    rect(width * 0.4, height * 0.85, height * 0.2, height * 0.2);
    rect(width * 0.6, height * 0.85, height * 0.2, height * 0.2);
    image(eval(perc.LH.implement), width * 0.4, height * 0.85);
    image(eval(perc.RH.implement), width * 0.6, height * 0.85);
}

function drawTechniques() {
    rectMode(CENTER);
    imageMode(CENTER);
    noFill();
    stroke(255);
    rect(width * 0.4, height * 0.6, height * 0.2, height * 0.2);
    rect(width * 0.6, height * 0.6, height * 0.2, height * 0.2);

    image(eval())
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