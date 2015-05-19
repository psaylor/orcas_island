define(['jquery', 'ractive', 'spoke', 'ractiveUi'],
    function($, Ractive, spoke, ui) {

    console.log('Mispro UI setup');
    var misproWords = [];

    var spellingRegex = /\w+/;

    var data = {
        misproWords: misproWords,
        magic: true,
        prefix: function (obj) {
            var mispro = obj.spelling.match(spellingRegex);
            console.log('misproLetters', mispro);
            return obj.word.slice(0, mispro.index);
        },
        mispro: function (obj) {
            var mispro = obj.spelling.match(spellingRegex);
            return mispro[0];
        },
        suffix: function (obj) {
            var mispro = obj.spelling.match(spellingRegex);
            var lastIndex = mispro.index + mispro[0].length;
            return obj.word.slice(lastIndex);
        },
    };

    var element = $('#mispro-container');

    var socket = spoke.sharedSocket.getSocket();
    var ioStream = spoke.sharedSocket.ioStream;

    var getPartial = function () {
        $.get('../misproTable.html')
        .done(function (partialHtml) {
            initialize(partialHtml);
        });
    };

    var initialize = function (template) {
        misproRactiveComponent = new Ractive({
            el: element,
            template: template,
            data: data,
        });

        misproRactiveComponent.on('synthesize', function (event) {
            var word = misproRactiveComponent.get(event.keypath).word;
            console.log('synth word', word);
            new spoke.Synthesizer(word);
        });

        misproRactiveComponent.on('play', function (event) {
            var misproWord = misproRactiveComponent.get(event.keypath);
            var data = {
                startFragment: misproWord.utteranceId,
                startIndex: misproWord.wordId,
                endFragment: misproWord.utteranceId,
                endIndex: misproWord.wordId,
            };
            console.log('Play word request:', data);
            socket.emit('playbackRequest', data);

        });

        misproRactiveComponent.on('toggleHighlight', function (event) {
            var word = misproRactiveComponent.get(event.keypath).word;
            var highlightSet = ui.component.get('mispronouncedWords');
            var index = highlightSet.indexOf(word);

            if (index >= 0) {
                highlightSet.splice(index, 1);
            } else {
                highlightSet.push(word);
            }
            ui.component.set('mispronouncedWords', highlightSet);
        });

        socket.on('result.spoke.mispro', function (misproWord) {
            console.log('Got mispro results from server:', misproWord);
            data.misproWords.push(misproWord);
            var highlightSet = ui.component.get('mispronouncedWords');
            highlightSet.push(misproWord.word);
            ui.component.set('mispronouncedWords', highlightSet);
        });



    };

    getPartial();
});
