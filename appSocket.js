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

    /* by default the client will connect to '/', so while these routes are
    * super cool, we won't use them unless we have to */
    // var stories = io
    //     .of('/stories/')
    //     .on('connection', function(socket) {
    //         console.log("Client reading a story");
    //     });
    

    io.on('connection', function(socket) {
        console.log("Connected to client socket"); 
        var timestamp = new Date().getTime();
        var recordings_dir = util.format(RECORDINGS_DIRECTORY_FORMAT, timestamp);
        fs.mkdirSync(recordings_dir);

        io.emit('tuning in', {listening: 'to you'});

        ss(socket).on('audioRecording', function(stream, data) {
            console.log("Expecting normal audio stream");
            console.log("Got stream for audioRecording and data", data, 'stream', stream);
            console.log("Stream readable?", stream.readable, "Writable?", stream.writable);

            var stream_id = data.fragment;
            var stream_text = data.text.toLowerCase().replace(".", "") + "\n";

            var rawFileName = util.format(RAW_FILE_NAME_FORMAT, recordings_dir, stream_id);
            var wavFileName = util.format(WAV_FILE_NAME_FORMAT, recordings_dir, stream_id);
            var txtFileName = util.format(TXT_FILE_NAME_FORMAT, recordings_dir, stream_id);

            console.log("Saving raw audio to file " + rawFileName);
            console.log("Saving converted wav audio to file " + wavFileName);

            var rawFileWriter = fs.createWriteStream(rawFileName, {encoding: 'binary'});
            stream.pipe(rawFileWriter);

            rawFileWriter.on('data', function(d) {
                console.log("Writing to raw file");
            });

            rawFileWriter.on('end', function() {
                console.log('End of writing to raw file');
            });

            stream.on('data', function(d) {
                console.log('Got stream data', typeof(d));
            });
            stream.on('end', function(e) {
                console.log('stream ended');
            });
        });
    });

};


module.exports = AppSocket;