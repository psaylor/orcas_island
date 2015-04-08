define(['jquery', 'storyRactive', 'socketio', 'socketio-stream'],
    function($, storyRactive, io, ioStream) {

        var socket = io();

        var storyData = storyRactive.data;
        var storyComponent = storyRactive.component;

        socket.on("connect", function() {
          console.log("Client socket connected!");
        });

        socket.on("disconnect", function() {
            console.log("Client disconnected from server, please wait...");
        });


        return {
            socket: socket,
            ioStream: ioStream,
        };
});


