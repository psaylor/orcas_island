var socketIO = require('socket.io');
var ss = require('socket.io-stream');
var util = require('util');
var fs = require('fs');

// %d is for the recording timestamp
// var RECORDINGS_DIRECTORY_FORMAT = '/data/sls/scratch/psaylor/recordings/%d';
var RECORDINGS_DIRECTORY_FORMAT = __dirname + '/recordings/%d'

// %d is for a number unique to each utterance within the same session
var RAW_FILE_NAME_FORMAT = '%s/utterance_%d.raw';
var WAV_FILE_NAME_FORMAT = '%s/utterance_%d.wav';
var TXT_FILE_NAME_FORMAT = '%s/utterance_%d.txt';

var AppSocket = function(server) {
    var io = socketIO(server);

    io.on('connection', function(socket) {
        console.log("Connected to client socket"); 
        var timestamp = new Date().getTime();
        var recordings_dir = util.format(RECORDINGS_DIRECTORY_FORMAT, timestamp);
        fs.mkdirSync(recordings_dir);

        io.emit('tuning in', {listening: 'to you'});

        ss(socket).on('audioStream', function(stream, data) {
            console.log("Receiving stream audio for data", data);

            var stream_id = data.fragment;
            var stream_text = data.text.toLowerCase().replace(".", "") + "\n";

            var rawFileName = util.format(RAW_FILE_NAME_FORMAT, recordings_dir, stream_id);
            var wavFileName = util.format(WAV_FILE_NAME_FORMAT, recordings_dir, stream_id);
            var txtFileName = util.format(TXT_FILE_NAME_FORMAT, recordings_dir, stream_id);

            console.log("Saving raw audio to file " + rawFileName);
            console.log("Saving converted wav audio to file " + wavFileName);

            var rawFileWriter = fs.createWriteStream(rawFileName, {encoding: 'binary'});

            stream.on('end', function(e) {
                console.log('stream ended');
            });

            stream.pipe(rawFileWriter);
            
        });

        socket.on('audioChunk', function (audioData) {
            console.log("on audioChunk", audioData.chunk, typeof(audioData.array));
            // console.log("Audio Data", audioData.array);
        });
    });

};


module.exports = AppSocket;