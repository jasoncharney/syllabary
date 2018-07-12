var initialized = false;
var myInst;
var tptButton, pnoButton, percButton;
var socket;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    socket = io('/client');

    background(0);
    fill(255);

    pnoButton = createButton('Keith');
    tptButton = createButton('Sam');
    percButton = createButton('Adam');
    pnoButton.position(0, 0).style('font-size', '72px');
    tptButton.position(0, height / 3).style('font-size', '72px');
    percButton.position(0, height * (2 / 3)).style('font-size', '72px');

    pnoButton.mousePressed(pnoButtonPushed);
    percButton.mousePressed(percButtonPushed);
    tptButton.mousePressed(tptButtonPushed);
}

function draw() {

}

function tptButtonPushed() {
    console.log('I am tpt');
    myInst = 0;
    socket.emit('instrument', myInst);
    initialized = true;
    pnoButton.remove();
    tptButton.remove();
    percButton.remove();
}

function pnoButtonPushed() {
    console.log('I am piano');
    myInst = 1;
    socket.emit('instrument', myInst);
    initialized = true;
    pnoButton.remove();
    tptButton.remove();
    percButton.remove();
}

function percButtonPushed() {
    console.log('I am perc');
    myInst = 2;
    socket.emit('instrument', myInst);
    initialized = true;
    pnoButton.remove();
    tptButton.remove();
    percButton.remove();
}