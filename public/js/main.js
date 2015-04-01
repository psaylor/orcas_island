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

require(['jquery', 'crossBrowserAudio', 'storyRactive', 'socketio', 'recorder'], 
    function($, crossBrowserAudio, storyRactive, io, recorder) {
        console.log("Loaded requirements for main.js");

        var context = new crossBrowserAudio.AudioContext();
        var SESSION = {audio: true, video: false};
        var audioStreamSource = null;
        var getUserMedia = crossBrowserAudio.getUserMedia;

        var storyData = storyRactive.data;
        var storyComponent = storyRactive.component;

        var socket = io();

        socket.on("connect", function() {
          console.log("Client socket connected!");
        });

        socket.on("disconnect", function() {
            console.log("Client disconnected from server, please wait...");
        });

        socket.on('tuning in', function(msg) {
          console.log("Got tuned in msg:", msg);
        });




});