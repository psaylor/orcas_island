define(['jquery', 'sharedAudio', 'storyRactive', 'clientSocket', 'promise'],
    function($, sharedAudio, storyRactive, clientSocket, Promise) {

        var context = sharedAudio.audioContext;

        console.log("player.js");

        var socket = clientSocket.socket;
        var ioStream = clientSocket.ioStream;

        var storyComponent = storyRactive.component;
        var storyData = storyRactive.data;

        // Set up play button listeners
        storyComponent.on('playFragment', function (event) {
            console.log('playFragment');
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

        storyComponent.on('playWord', function (event) {
            console.log('playWord');
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



        // Listen for playback result, and play it
        ioStream(socket).on('playbackResult', function (audioStream, data) {
            console.log('Playback result for ', data, audioStream);
            var audioDataArray = [];


            audioStream.on('data', function (data) {
                audioDataArray.push(data);
            });

            audioStream.on('end', function () {
                console.log("End of streamed audio, num buffers", audioDataArray.length);
                var totalBufferByteLength = 0;
                for (var i = 0; i < audioDataArray.length; i++) {
                    totalBufferByteLength += audioDataArray[i].byteLength;
                }

                audioDataBuffer = new Uint8Array(totalBufferByteLength);
                var bufferByteOffset = 0;
                for (var j = 0; j < audioDataArray.length; j++) {
                    var typedArray = new Uint8Array(audioDataArray[j]);
                    audioDataBuffer.set(typedArray, bufferByteOffset);
                    bufferByteOffset += typedArray.byteLength;
                }

                sharedAudio.promiseDecodeAudioData(audioDataBuffer.buffer)
                    .then(sharedAudio.promisePlayAudioData)
                    .then(function() {
                        console.log('Audio finished playing');
                    });
            });

        });


});