define(['jquery', 'ractive'], function($, Ractive) {

    var data = {
        recording: false,
        recordingFragment: -1, // index of the fragment currently being recorded if any
        focusedFragment: 0,
        playbackReady: function (fragNum) {
            return false;
        }, // a true or false for each fragment's playback readiness
        isFocused: function (fragNum) {
            return this.get('focusedFragment') === fragNum;
        },
        isRecording: function (fragNum) {
            return this.get('recordingFragment') === fragNum;
        },
        and: function(a, b) {
            return a && b;
        },

    };

    var element = $("#story-container");
    var template = element.html();
    /* Initialize the Ractive component */
    storyRactive = new Ractive({
        el: element,
        template: template,
        data: data,
    });

    // storyRactive.on('toggleRecord', function (event) {
    //     console.log("Toggled!", event);
    //     var jqueryNode = $(event.node);
    //     var fragmentNum = jqueryNode.data("fragment");
    //     if (storyRactive.get('recording')) {
    //         storyRactive.set('recordingFragment', -1);
    //         storyRactive.set('recording', false);
    //     } else {
    //         storyRactive.set('recording', true);
    //         storyRactive.set('recordingFragment', fragmentNum);
    //     }
    // });

    storyRactive.on('hoverPanel', function (event) {
        var jqueryNode = $(event.node);
        var fragmentNum = jqueryNode.data("fragment");
        storyRactive.set('focusedFragment', fragmentNum);

    });

    storyRactive.on('unhoverPanel', function (event) {
        var jqueryNode = $(event.node);
        storyRactive.set('focusedFragment', -1);
    });

    storyRactive.on('doneReading', function (event) {
        console.log("Done Reading Story");
        // process
    });
    
    storyRactive.on('playFragment', function (event) {
        var fragment = $(event.node);
        console.log('Playback request for fragment', fragment.data());
    });

    return {
        data: data,
        component: storyRactive,
    };

});