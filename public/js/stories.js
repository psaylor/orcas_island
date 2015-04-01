$(function() {

console.log("Running stories.js");
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

var initializeRactive = function () {
    storyRactive = new Ractive({
        el: element,
        template: template,
        data: data,
    });
    window.ractive = storyRactive;

    storyRactive.on('toggleRecord', function (event) {
        console.log("Toggled!", event);
        var jqueryNode = $(event.node);
        var fragmentNum = jqueryNode.data("fragment");
        if (storyRactive.get('recording')) {
            storyRactive.set('recordingFragment', -1);
            storyRactive.set('recording', false);
        } else {
            storyRactive.set('recording', true);
            storyRactive.set('recordingFragment', fragmentNum);
        }
    });

    storyRactive.on('hoverPanel', function (event) {
        var jqueryNode = $(event.node);
        var fragmentNum = jqueryNode.data("fragment");
        storyRactive.set('focusedFragment', fragmentNum);

    });

    storyRactive.on('unhoverPanel', function (event) {
        var jqueryNode = $(event.node);
        storyRactive.set('focusedFragment', -1);
    });


};
initializeRactive();
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

});
