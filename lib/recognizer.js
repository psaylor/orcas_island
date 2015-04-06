var fs = require('fs');
var SoxCommand = require('sox-audio');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var spawn = require('child_process').spawn;

var Recognizer = function () {

};

var RECOGNIZER_SAMPLE_RATE = 16000;

Recognizer.convertToWav = function (rawInputFile, sampleRate, wavOutputFile, cb) {
    var command = SoxCommand(rawInputFile)
        .inputSampleRate(sampleRate)
        .inputEncoding('signed')
        .inputBits(16)
        .inputChannels(1)
        .inputFileType('raw')
        .output(wavOutputFile)
        .outputSampleRate(RECOGNIZER_SAMPLE_RATE);
    
    command.on('error', function (err, stdout, stderr) {
        console.log('Cannot process audio: ' + err.message);
        console.log('Sox Command Stdout: ', stdout);
        console.log('Sox Command Stderr: ', stderr)
    });
    command.on('end', function() {
        cb(wavOutputFile);
    });
    command.run();
};

Recognizer.recognize = function (wavFile, cb) {
    console.log("Running recognition on ", wavFile);
    var command = ['./nut_recognizer.sh', wavFile].join(' ');
    var child = exec(command,
        function (error, stdout, stderr) {
            console.log('Recognition stdout', stdout);
            console.log('Recognition stderr', stderr);
            if (error !== null) {
                console.log('Recognition exec error', error);
            }
            cb(stdout);
    });
};

module.exports = Recognizer;