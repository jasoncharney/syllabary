function PercussionListeners() {
    socket.on('percSettings', function (msg) {
        console.log(msg);
        //function calculateEnvelope(msg.envelope);
    });
}