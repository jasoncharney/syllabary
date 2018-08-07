var player2Button, player1Button, player0Button;

function initButtons() {
    player0Button = createButton('Player 0');
    player1Button = createButton('Player 1');
    player2Button = createButton('Player 2');

    player0Button.position(0, 0);
    player1Button.position(0, height / 3);
    player2Button.position(0, height * (2 / 3));

    player0Button.mousePressed(player0ButtonPushed);
    player1Button.mousePressed(player1ButtonPushed);
    player2Button.mousePressed(player2ButtonPushed);
}

function player0ButtonPushed() {
    myPart = 0;
    socket.emit('player', myPart);
    initialized = true;
    player1Button.remove();
    player2Button.remove();
    player0Button.remove();

}

function player1ButtonPushed() {
    myPart = 1;
    socket.emit('player', myPart);
    initialized = true;
    player1Button.remove();
    player2Button.remove();
    player0Button.remove();

}

function player2ButtonPushed() {
    myPart = 2;
    socket.emit('player', myPart);
    initialized = true;
    player1Button.remove();
    player2Button.remove();
    player0Button.remove();

}