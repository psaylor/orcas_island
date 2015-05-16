define(['jquery', 'spoke', 'ractiveUi'], function($, spoke, ui) {

    console.log('> player.js', $, spoke, ui);

    var socket = spoke.sharedSocket.getSocket();
    var ioStream = spoke.sharedSocket.ioStream;

    var uiComponent = ui.component;
    var uiData = ui.data;

    // Set up play button listeners
    uiComponent.on('playFragment', function (event) {
        var element = $(event.node);
        var data = {
            startFragment: element.data('fragment'),
            startIndex: 0,
            endFragment: element.data('fragment'),
            endIndex: -1, // play til end
        };
        console.log('Play fragment:', data);
        socket.emit('playbackRequest', data);
    });

    uiComponent.on('playWord', function (event) {
        var element = $(event.node);
        var data = {
            startFragment: element.data('fragment'),
            startIndex: element.data('index'),
            endFragment: element.data('fragment'),
            endIndex: element.data('index'),
        };
        console.log('Play word:', data);
        socket.emit('playbackRequest', data);
    });

    /* Listen for playback result, and play it */
    ioStream(socket).on('playbackResult', function (audioStream, data) {
        console.log('Playback result for ', data, audioStream);
        var player = spoke.Player(audioStream);

        player.on('ready.spoke.player', function () {
            console.log('Audio ready to play.');
        });

        player.on('done.spoke.player', function () {
            console.log('Audio finished playing.');
        });
    });

});