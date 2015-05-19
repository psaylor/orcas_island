var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');

/* GET users listing. */
router.get('/:storyId', function(req, res, next) {
    var  storyId = req.params.storyId;
    var storyDataPromise = getStoryData(storyId);
    storyDataPromise.then(function(storyData) {
        var data = {
            story: storyData,

        };
        console.log("Server view data:", data);
        res.render('story', data);
    });
});

var extractStoryData = function(parsedXml) {
    var data = {
        title: parsedXml.readable.title,
        author: parsedXml.readable.author,
        fragments: [],
        normalizeString: function (word) {
            console.log('called normalizeString', word);
            var result = utils.normalizeString(word);
            console.log('normalizeString on', word, ':', result);
            return result;
        },
    };
    var content = parsedXml.readable.content.split(/\n/);
    for (var i = 0; i < content.length; i++) {
        var line = content[i];
        var text = utils.normalizeString(line);
        data.fragments[i] = {
            words: line.split(' '),
            normalizedWords: text.split(' '),
            text: text,
        };
    }
    return data;
};

var getStoryData = function(storyId) {
    var storyPath = __dirname + '/../public/stories/' + storyId + '.xml';
    console.log("Looking for storyPath", storyPath);

    var storyDataPromise = utils.parseXMLFile(storyPath)
        .then(extractStoryData);
    return storyDataPromise;
};

module.exports = router;
