/*
want something like
recorder = new Recorder({
    desiredSampleRate: 16000,
    desiredFormat: 'wav',
});
stream.pipe(recorder)
    .pipe(recognizer)
    or .then(recognize)
    .then(parseTimingData)
    .then()
*/