define(['jquery', 'ractive'], function($, Ractive) {

    var data = {

        recordingFragment: -1, // index of the fragment currently being recorded if any
        recording: function () {
            return this.get('recordingFragment') !== -1;
        },
        focusedFragment: 0,
        playing: false,
        playbackStates: [],
        playbackReady: function (fragNum) {
            return this.get('playbackStates')[fragNum] === true;
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

    var element = $('#story-container');
    var template = element.html();
    // console.log('Ractive template:', template);
    /* Initialize the Ractive component */
    ractiveComponent = new Ractive({
        el: element,
        template: template,
        data: data,
    });

    ractiveComponent.on('hoverPanel', function (event) {
        var jqueryNode = $(event.node);
        var fragmentNum = jqueryNode.data('fragment');
        ractiveComponent.set('focusedFragment', fragmentNum);

    });

    ractiveComponent.on('unhoverPanel', function (event) {
        var jqueryNode = $(event.node);
        ractiveComponent.set('focusedFragment', -1);
    });

    ractiveComponent.on('doneReading', function (event) {
        console.log('Done Reading Story');
        // process
    });

    return {
        data: data,
        component: ractiveComponent,
    };

});

/* 
    if you load the client-side js for a ractive template in its template, 
    then you can't use a top level element (because it will include the script tag 
    that loaded this file, and will circularly load, render, re-insert its own script
    tag into the page, re-load, etc). 
    So either...
    - strip out the script tag
    - hoist it to the top
    - put it in the layout?
    - use a smaller container that doesn't include the script tag
*/