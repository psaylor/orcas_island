var socketIO = require('socket.io');
var ss = require('socket.io-stream');
var util = require('util');
var fs = require('fs');
var extfs = require('extfs');
var Spoke = require('spoke');
var Promise = require('bluebird');
var fsAsync = Promise.promisifyAll(fs);
var _ = require('underscore');

var utils = require('./lib/utils');

if (utils.isProduction()) {
    var RECORDINGS_DIRECTORY_FORMAT = '/data/sls/scratch/psaylor/recordings/%d';
    var DATA_DIRECTORY_FORMAT = '/data/sls/scratch/psaylor/data/%d';
} else {
    var RECORDINGS_DIRECTORY_FORMAT = __dirname + '/recordings/%d';
    var DATA_DIRECTORY_FORMAT = __dirname + '/data/%d';
}

// %d is for the recording timestamp
// var RECORDINGS_DIRECTORY_FORMAT = '/data/sls/scratch/psaylor/recordings/%d';
// var RECORDINGS_DIRECTORY_FORMAT = __dirname + '/recordings/%d'

// %d is for a number unique to each utterance within the same session
var RAW_FILE_NAME_FORMAT = '%s/utterance_%d.raw';
var WAV_FILE_NAME_FORMAT = '%s/utterance_%d.wav';
var TXT_FILE_NAME_FORMAT = '%s/utterance_%d.txt';

var TIMINGS_DIRECTORY_FORMAT = '%s/time';
var MISPRO_DIRECTORY_FORMAT = '%s/misp';
// first and second %d are speaker, which is timestamp
// third %d is utterance number
var TIMING_FILE_NAME_PATTERN = /utterance_\d+(?=.txt)/;
var TIMING_FILE_ID_PATTERN = /\d+/;
var TIMING_PATH_FORMAT = '%s/%s';
var MISPRO_FILE_NAME_PATTERN = '%s/utterance_%d.out';
var UTTERANCE_ID_PATTERN = /utterance_(\d)+.out/;



var AppSocket = function(server) {
    var io = socketIO(server);
    var player = new Spoke.Player();

    io.on('connection', function(socket) {
        console.log('Connected to client socket'); 
        var timestamp = new Date().getTime();
        var recordingsDir = util.format(RECORDINGS_DIRECTORY_FORMAT, timestamp);
        var dataOutputDir = util.format(DATA_DIRECTORY_FORMAT, timestamp);

        var timingData = {};

        // fs.mkdirSync(recordingsDir);
        var recDirPromise = fsAsync.mkdir(recordingsDir);
        var dataDirPromise = fsAsync.mkdir(dataOutputDir);

        /* Use Spoke library for processing audio to/from client */
        var recorder = new Spoke.Recorder();
        var player = new Spoke.Player();
        var recognizer = new Spoke.Recognizer();
        var alignment = new Spoke.Alignment(dataOutputDir);
        var mispro = new Spoke.Mispro(dataOutputDir);

        var directoriesReady = Promise.join(recDirPromise, dataDirPromise)
            .then(function () {
                return alignment._initDirAsync();
            })
            .then(function () {
                console.log('Recording and data directories are ready');
                socket.emit('ready');
            });

        /*ss(socket).on('audioStream', function(stream, data) {
            console.log('Receiving stream audio for data', data);

            var streamId = data.fragment;
            var streamText = data.text.toLowerCase().replace('.', '') + '\n';
            var clientSampleRate = data.sampleRate;

            var rawFileName = util.format(RAW_FILE_NAME_FORMAT, recordingsDir, streamId);
            var wavFileName = util.format(WAV_FILE_NAME_FORMAT, recordingsDir, streamId);
            var txtFileName = util.format(TXT_FILE_NAME_FORMAT, recordingsDir, streamId);

            console.log('Saving raw audio to file ' + rawFileName);
            console.log('Saving converted wav audio to file ' + wavFileName);

            var rawFileWriter = fs.createWriteStream(rawFileName, {encoding: 'binary'});
            fs.writeFile(txtFileName, streamText);

            stream.on('end', function(e) {
                console.log('audio stream', streamId, 'ended');
            });

            var onRecognitionResult = function (err, result) {
                if (err) {
                    console.log('Error with recognizing', wavFileName, err);
                    return;
                }
                console.log('Recognition for', wavFileName, ':', result);
            };

            var onForcedAlignmentResult = function (err, alignmentFile) {
                if (err) {
                    socket.emit('audioStreamResult', {
                        success: false,
                        fragment: streamId,
                    });
                    return;
                }
                console.log('Forced alignment for', wavFileName, ':', alignmentFile);
                Recognizer.getAlignmentResults(alignmentFile, 
                    function(err, fragmentTimingData) {
                        if (err) {
                            console.log('Alignment Results error:', err);
                            return;
                        }
                        console.log('Alignment Results:', fragmentTimingData);
                        timingData[streamId] = fragmentTimingData;
                        socket.emit('audioStreamResult', {
                            success: (err === null),
                            fragment: streamId,
                        });
                });
               
            };

            var onWavConversion = function (err, result) {
                if (err) {
                    console.log('Error converting wav file', err);
                    return;
                }
                Recognizer.forcedAlignment(wavFileName, txtFileName, 
                    dataOutputDir, onForcedAlignmentResult);
            };

            stream.pipe(rawFileWriter);
            stream.on('data', function(data) {
                console.log('Streaming data...');
            });
            Recognizer.convertToWav(stream, clientSampleRate, wavFileName, onWavConversion);
            
        });
        */

        ss(socket).on('audioStream', function (stream, metadata) {
            console.log('Receiving audio stream with metadata', metadata);

            var utteranceId = metadata.fragment;
            var utteranceText = metadata.text.toLowerCase().replace('.', '') + '\n';
            var clientSampleRate = metadata.sampleRate;

            var rawFilename = util.format(RAW_FILE_NAME_FORMAT, recordingsDir, utteranceId);
            var wavFilename = util.format(WAV_FILE_NAME_FORMAT, recordingsDir, utteranceId);
            var txtFilename = util.format(TXT_FILE_NAME_FORMAT, recordingsDir, utteranceId);

            console.log('Saving raw audio to file ', rawFilename);
            console.log('Saving converted wav audio to file ', wavFilename);
            console.log('Saving text to file', txtFilename);

            var txtPromise = fsAsync.writeFileAsync(txtFilename, utteranceText);
            var recPromise = recorder.convertAndSaveAsync(stream, wavFilename);
            recPromise.catch(function reject (err) {
                    socket.emit('error.spoke.recorder', metadata);
                })
                .then(function resolve (result) {
                    console.log('Wav saved to', result);
                    socket.emit('success.spoke.recorder', metadata); 
                });

            var rawRecPromise = recorder.saveRawAsync(stream, rawFilename);

            Promise.join(recPromise, txtPromise)
                .then(function (result) {
                    console.log('Doing forced alignment on', wavFilename, txtFilename);
                    return alignment.forcedAlignmentAsync(wavFilename, txtFilename);
                })
                .then(function (result) {
                    console.log('Parsing forced alignment output from', result);
                    return alignment.getAlignmentResultsAsync(result);
                })
                .catch(function reject (err) {
                    console.log('Forced alignment error', err);
                    socket.emit('error.spoke.alignment', metadata);
                })
                .then(function resolve (result) {
                    console.log('Alignment result:', result);
                    timingData[utteranceId] = result;
                    socket.emit('success.spoke.alignment', metadata);
                })
                .then(function resolve (err) {
                    return mispro.processAsync(wavFilename);
                })
                .catch(function reject (err) {
                    console.log('Mispro process error:', err);
                })
                .then(function resolve(result) {
                    console.log('Mispro preprocess finished', result);
                });
        });

        socket.on('doneReading', function () {
            var misproDetectionPromise = mispro.misproDetectionAsync()
                .then(function (result) {
                    console.log('Got mispro results and parsing:', result);
                    var parsedResults = mispro.getMisproResults(result);
                    socket.emit('result.spoke.mispro', parsedResults);
                });
        });

        /* 
        A playback request specifying the fragment to playback
        */
        socket.on('playbackRequest', function (data) {
            var wavFileName = util.format(WAV_FILE_NAME_FORMAT, recordingsDir, 
                data.startFragment);
            console.log('playback request for', data);
            console.log('timing data for fragment:', timingData[data.startFragment]);
            console.log('timing data for first:', timingData[data.startFragment][data.startIndex]);

            // TODO: check if file name exists first
            var meta = data;
            
            // setup a stream to communicate with client, then the audio should
            // be piped onto this stream
            var stream = ss.createStream();
            ss(socket).emit('playbackResult', stream, meta);
            
            var startSample = timingData[data.startFragment][data.startIndex].start_sample;
            var endIndex = data.endIndex;
            if (endIndex < 0) {
                // subtract from the end
                endIndex = timingData[data.endFragment].length + endIndex;
            }
            var endSample = timingData[data.endFragment][endIndex].end_sample;

            if (data.startFragment === data.endFragment) {
                if ((data.startIndex === 0) && (data.endIndex === -1)) {
                    // playing back a single whole utterance
                    console.log('Playing back', wavFileName);
                    player.stream(wavFileName, stream);
                } else {
                    // playing back part of one utterance
                    console.log('Playing back part of', wavFileName);
                    player.trimAudio(wavFileName, stream, startSample, endSample);   
                }
            } else {
                // playing back many utterances
                console.log('Many utterances not fully implemented');
                var lastWavFilename = util.format(WAV_FILE_NAME_FORMAT, recordingsDir, data.endFragment);
                player.trimAndConcatAudio([wavFileName, lastWavFilename], stream, startSample, endSample);
            }
            
        });

        socket.on('disconnect', function () {
            console.log('Socket disconnect', socket.id);
        });

    });

};


module.exports = AppSocket;