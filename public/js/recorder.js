define(['jquery', 'sharedAudio', 'storyRactive', 'clientSocket'],
    function($, sharedAudio, storyRactive, clientSocket) {

        var context = sharedAudio.audioContext;
        var AUDIO_SAMPLING_RATE = context.sampleRate;

        console.log("Recorder.js");

        var socket = clientSocket.socket;
        var ioStream = clientSocket.ioStream;

        var storyData = storyRactive.data;
        var storyComponent = storyRactive.component;

        var recording = false;
        var currentFragment = 0;

        var convertFloat32ToInt16 = function (buffer) {
            var l = buffer.length;
            var buf = new Int16Array(l);
            while (l--) {
                buf[l] = Math.min(1, buffer[l])*0x7FFF;
            }
            return buf.buffer;
        };

        var clearSelection = function () {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
        };

        storyComponent.on('toggleRecord', function (event) {
            var element = $(event.node);
            var fragment = element.data('fragment');
            console.log('Toggling recording for fragment', fragment);
            console.log('event', event);
            console.log('element', element);
        });

        socket.on('audioStreamResult', function(result) {
            console.log('Audio stream result for', result.fragment,':', result.success);
            storyData.playbackStates[result.fragment] = result.success;
            storyComponent.set('playbackStates', storyData.playbackStates);
        });

        var recordButtonSetup = function(recordBtn, fragmentElement) {
            // console.log("Setting up record button", recordBtn, fragmentElement);
            fragmentElement = $(fragmentElement);
            var binaryAudioStream = null;
            var audioMetadata = { 
                "fragment": fragmentElement.data("fragment"),
                "text": fragmentElement.data("text"),
                "sampleRate": context.sampleRate,
            };

            var setupStream = function() {
                console.log("Setting up new stream");
                
                binaryAudioStream = ioStream.createStream();
                ioStream(socket).emit('audioStream', binaryAudioStream, audioMetadata);
                recording = true;
                storyComponent.set('recording', recording);
                return binaryAudioStream;
            };

            var audioChunk = 0;
            var recorderProcess = function (audioProcessingEvent) {
                // since we are recording in mono we only need the left channel
                var left = audioProcessingEvent.inputBuffer.getChannelData(0); // PCM data samples from left channel
                var converted = convertFloat32ToInt16(left);
                console.log("Writing buffer to binary stream: %d ", converted.byteLength);

                /* this is hacky but avoids a lot of overhead, should make a wrapper
                library that includes this function though since Buffer is a Node.js thing
                or just make all client side with browserify instead of requirejs */
                binaryAudioStream.writeAudio(converted);
            };

            var recorderBufferSize = 2048;
            // create a javascript node for recording
            var recorder = context.createScriptProcessor(recorderBufferSize, 1, 1);
            // specify the processing function
            recorder.onaudioprocess = recorderProcess;
            

            var startRecorder = function () {
                recording = true;
                // connect recorder to the previous destination so it gets called
                recorder.connect(context.destination);

                console.log("Setting up recorder.");
                sharedAudio.audioStreamPromise.then(function(audioStreamSource) {
                    console.log("Then got audioStreamSource for recorder");
                    audioStreamSource.connect(recorder);
                    console.log("Recorder started");
                });

                storyComponent.set('recordingFragment', fragmentElement.data('fragment'));
                storyComponent.set('recording', recording);
            };

            var stopRecording = function () {
                recorder.disconnect();
                binaryAudioStream.end();
                audioChunk = 0;
                recording = false;
                storyComponent.set('recording', recording);
                storyComponent.set('recordingFragment', -1);
            };

            var toggleRecording = function () {
                console.log("Toggling recording state from", recording);
                if (recording) {
                    console.log("Disconnecting recorder");
                    // binaryAudioStream.
                    stopRecording();
                    binaryAudioStream = null;
                } else {
                    console.log("Starting recorder");
                    binaryAudioStream = setupStream();
                    console.log("binaryAudioStream", binaryAudioStream);
                    startRecorder();
                }
            };

            $(recordBtn).click(toggleRecording);
        };

        var recordButtons = $(".record-btn");
        var storyLines = $(".readable-fragment");
        storyLines.map(function(i, line) {
            recordButtonSetup(recordButtons[i], line);
        });

        return {};
});