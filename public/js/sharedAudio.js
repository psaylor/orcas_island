define(['jquery', 'crossBrowserAudio', 'promise'],
    function($, crossBrowserAudio) { 

        var context = new crossBrowserAudio.AudioContext();

        var SESSION = {audio: true, video: false};

        var audioStreamPromise = crossBrowserAudio.promiseUserMedia(SESSION)
            .then(function(localMediaStream) {
                console.log("SharedAudio got localmediastream", typeof(localMediaStream));
                var audioStreamSource = context.createMediaStreamSource(localMediaStream);
                console.log("Created audio stream", typeof(audioStreamSource));
                return audioStreamSource;
            })
            .catch(function(error) {
                alert('getUserMedia: ' + error.name + '\n' + error.message);
                console.log('Media access rejected.', error);
            });

        var sharedAudio = {
            audioContext: context,
            audioStreamPromise: audioStreamPromise,
        };

        return sharedAudio;
});