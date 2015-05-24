define(['jquery', 'ractive', 'spoke', 'ractiveUi'],
    function($, Ractive, spoke, ui) {

    console.log('Mispro UI setup');
    var misproWords = [];

    var spellingRegex = /\w+/;

    var data = {
        misproWords: misproWords,
        magic: true,
        misproWord: function (obj) {
            var spelling = obj.spelling.split('');
            var word = obj.word.split('');
            var outputHtml = ['<span class="word">'];
            var inMispro = false;
            word.forEach(function (val, index, arr) {
                if (val === spelling[index]) {
                    // this part was mispronounced
                    if (!inMispro) {
                       outputHtml.push('<span class="mispro-letters">');
                       inMispro = true;
                    }
                } else {
                    // these letters are fine
                    if (inMispro) {
                        outputHtml.push('</span>');
                        inMispro = false;
                    }
                }
                outputHtml.push(val);
            });

            outputHtml.push('</span>');
            return outputHtml.join('');
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
            console.log('toggleHighlight for', word);
            var highlightSet = ui.component.get('mispronouncedWords');
            console.log('highlightSet', highlightSet);
            var index = highlightSet.indexOf(word);
            if (index >= 0) {
                console.log('was in, now removing');
                highlightSet.splice(index, 1);
                // console.log('new highlightSet', highlightSet);
            } else {
                highlightSet.push(word);
            }
            ui.component.set('mispronouncedWords', highlightSet);
        });

        socket.on('result.spoke.mispro', function (misproWord) {
            console.log('Got mispro results from server:', misproWord);
            data.misproWords.push(misproWord);
        });



    };

    getPartial();
});
