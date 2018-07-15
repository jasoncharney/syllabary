var tptButton, pnoButton, percButton;

function initButtons() {
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

function tptButtonPushed() {
    myInst = 0;
    socket.emit('instrument', myInst);
    initialized = true;
    pnoButton.remove();
    tptButton.remove();
    percButton.remove();
}

function pnoButtonPushed() {
    myInst = 1;
    socket.emit('instrument', myInst);
    initialized = true;
    pnoButton.remove();
    tptButton.remove();
    percButton.remove();
}

function percButtonPushed() {
    myInst = 2;
    socket.emit('instrument', myInst);
    initialized = true;
    pnoButton.remove();
    tptButton.remove();
    percButton.remove();
}