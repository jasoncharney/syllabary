function splitBG() {
    fill(255);
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width / 3, height);
    rect(width - (width / 3), 0, width, height);
}

function PercTechnique(implement, posX, posY) {
    this.implement = implement;
    this.posX = posX;
    this.posY = posY;
    var displayImplement;

    textFont(percussionFont);
    textSize(height / 3);
    fill(0);
    textAlign(CENTER);

    if (implement == 'bow') {
        displayImplement = '–';
    }
    if (implement == 'mallet') {
        displayImplement = '%';
    }

    text(displayImplement, posX, posY);
}