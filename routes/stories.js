var express = require('express');
var router = express.Router();
var utils = require('../public/javascripts/utils');

/* GET users listing. */
router.get('/:storyId', function(req, res, next) {
    var  storyId = req.params.storyId;
    var storyDataPromise = getStoryData(storyId);
    storyDataPromise.then(function(storyData) {
        res.render('story', constructDataObject(storyData));
    });
});

var extractStoryData = function(parsedXml) {
    var data = {
        title: parsedXml.readable.title,
        author: parsedXml.readable.author,
        fragments: [],
    };
    var content = parsedXml.readable.content.split(/\n/);
    for (var i = 0; i < content.length; i++) {
        var line = content[i];
        data.fragments[i] = {
            words: line.split(' '),
            text: utils.normalizeString(line),
        };
    }
    return data;
};

var constructDataObject = function(storyObj) {
    return data = {
        story: storyObj,
        recording: false,
        recordingFragment: -1, // index of the fragment currently being recorded if any
        focusedFragment: 0,
        playbackReady: [], // a true or false for each fragment's playback readiness
        isFocused: function (fragNum) {
            return this.get('focusedFragment') === fragNum;
        },
        isRecording: function (fragNum) {
            return this.get('recordingFragment') === fragNum;
        },
    };
};

var getStoryData = function(storyId) {
    var storyPath = __dirname + '/../public/stories/' + storyId + '.xml';
    console.log("Looking for storyPath", storyPath);

    var storyDataPromise = utils.parseXMLFile(storyPath)
        .then(extractStoryData);
    return storyDataPromise;
};

module.exports = router;
