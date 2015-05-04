define(['jquery', 'spoke', 'ractiveUi'], function($, spoke, ui) {

    console.log('> recorderSetup.js');

    var socket = spoke.sharedSocket.getSocket();
    var ioStream = spoke.sharedSocket.ioStream;

    var uiData = ui.data;
    var uiComponent = ui.component;


    var clearSelection = function () {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    };

    var recorders = [];
    var recordButtons = $('.record-btn');
    recordButtons.map(function(i, btn) {
        btn = $(btn);
        var fragment = btn.data('fragment');

        var recOptions = {
            audioMetadata: { 
                fragment: fragment,
                text: btn.data('text'),
            },
        };

        var recorder = spoke.Recorder(btn, recOptions);
        
        /* Create custom data object to be passed back on event object when 
        start or stop is fired. Accessible as event.data */
        var onToggleData = {
            fragment: fragment,
        };
        recorder.on('start.spoke.recorder', onToggleData, function (event) {
            console.log('Started spoke recorder:', event);
            uiComponent.set('recordingFragment', event.data.fragment);
        });

        recorder.on('stop.spoke.recorder', onToggleData, function (event) {
            console.log('Stopped spoke recorder', event);
            uiComponent.set('recordingFragment', -1);
        });

        recorder.socket.on('audioStreamResult', function (result) {
            if (result.fragment === fragment) {
                console.log('Direct audio stream result for', result.fragment,':', result.success);
                uiData.playbackStates[result.fragment] = result.success;
                uiComponent.set('playbackStates', uiData.playbackStates);
            }
        });

        recorders[i] = recorder;
    });

    return {
        recorders: recorders,
    };
});