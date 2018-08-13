function drawValves() {
    rectMode(CENTER);
    stroke(255);
    fill(0, 100);
    strokeWeight(2);
    rect(width / 2, height / 2, height * 0.15, height * 0.5);

    strokeWeight(2);

    fill(myValves[0] * 255);
    ellipse(width / 2, height / 3, height * 0.1, height * 0.1);

    fill(myValves[1] * 255);
    ellipse(width / 2, height / 2, height * 0.1, height * 0.1);

    fill(myValves[2] * 255);
    ellipse(width / 2, height * (2 / 3), height * 0.1, height * 0.1);
}

function drawArticulation() {
    rectMode(CENTER);
    fill(0);
    stroke(255);
    strokeWeight(2);
    rect(width * 0.5, height * 0.9, width * 0.1, height * 0.2);

    imageMode(CENTER);
    image(sfort, width / 2, height * 0.9, height * 0.2, height * 0.2);
    //noStroke();
    //fill(255);
    //textFont(20);
    //var w = textWidth('');
    //textFont(pitchFont, 200);
    //textAlign(CENTER, BASELINE);
    //text(str(sfort), width * 0.5, height * 0.9 - (textDescent()));
}

function drawAir() {
    noStroke();
    fill((255 * myAirSpeed) + 50);
    rectMode(CENTER);
    beginShape();
    vertex((width / 2) - myAirSpeed * (width * 0.05), height);
    vertex((width / 2) + myAirSpeed * (width * 0.05), height);
    vertex((width / 2) + myAirSpeed * (width * 0.15), 0);
    vertex((width / 2) - myAirSpeed * (width * 0.15), 0);
    endShape(CLOSE);
    //console.log(mouseX / width, mouseY / height);
}


    // drawStaves(vOffset) {
    //     var vertOffset = vOffset * this.h;
    //     rect(this.x, this.y, this.w, this.h);
    //     for (var i = 1; i < 6; i++) {
    //         var vertPos = this.y + (i * (vOffset / 6) * this.h);
    //         line(this.x, vertPos + vertOffset, this.x + this.w, vertPos + vertOffset);
    //     }
    // }
}