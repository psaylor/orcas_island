require.config({
    paths: {
        'jquery': 'https://code.jquery.com/jquery-1.11.0.min',
        'ractive': 'http://cdn.ractivejs.org/latest/ractive.min',
        'modernizr': 'third-party/modernizr.custom.68208',
        'socketio': '/socket.io/socket.io',
        'socketio-stream': 'third-party/socket.io-stream',
        'promise': 'https://cdn.jsdelivr.net/bluebird/latest/bluebird.min',
    },
});

require(['jquery', 'crossBrowserAudio', 'storyRactive', 'socketio', 'recorder', 'player'], 
    function($, crossBrowserAudio, storyRactive, io, recorder, player) {
        console.log("Loaded requirements for main.js");

});