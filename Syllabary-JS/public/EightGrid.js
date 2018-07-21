function syncDraw() {
    noStroke();
    fill(255);
    rectMode(CORNER);
    rect(beat * (width / 4), 0, width / 4, height * 0.33);
}

function gridDraw() {
    noFill();
    stroke(255);
    strokeWeight(10);
    //draw quarter notes
    for (var i = 1; i < 4; i++) {
        line((i / 4) * width, 0, (i / 4) * width, height);
    }
    stroke(127);
    strokeWeight(5);
    for (var i = 1; i < 8; i += 2) {
        line((i / 8) * width, 0, (i / 8) * width, height);
    }
}

function grid8Draw() {
    if (grid8 !== undefined) {
        for (var i = 0; i < grid8.length; i++) {
            if (grid8[i] == 1) {
                noStroke();
                fill(255, 0, 0);
                rect((width / 8) * i, height / 3, width / 8, height / 3);
                if (grid8Accents[i] == 1) {
                    fill(0);
                    textFont(articFont);
                    textSize(width / 8);
                    textAlign(CENTER, CENTER);
                    text('x', (width / 8 * i), height / 3, width / 8, height / 3);
                }
            }
        }
    }
}