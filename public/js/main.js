require.config({
    paths: {
        'jquery': [
            'https://code.jquery.com/jquery-1.11.0.min',
            '../../node_modules/spoke-client/lib/js/third-party/jquery-1.11.0.min',
        ],
        'bootstrap': [
            '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
        ],
        'ractive': [
            'https://cdnjs.cloudflare.com/ajax/libs/ractive/0.7.2/ractive.min',
            '../../node_modules/spoke-client/lib/js/third-party/ractive-0.7.2.min',
        ],
        'spoke': 'spoke',
    },
    shim: {
        'bootstrap': {
            'deps': ['jquery'],
        },
    },
});

/* Cannot reuse names of spoke module files, like player and recorder; maybe I should rename those files to spokePlayer and spokeRecorder*/
require(['ractiveUi', 'playerSetup', 'recorderSetup'], 
    function() {
        console.log('Loaded requirements for main.js');

});