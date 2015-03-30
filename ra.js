var EscapeDelims = require('escape-delims');
var fs = require('fs');
var Ractive = require('ractive');

var escapeDelims = new EscapeDelims(['{{', '}}']);

var template = fs.readFileSync('views/fragment.html', 'utf8');

console.log('\nTemplate', template);
var escapedTemplate = escapeDelims.escape(template);
console.log('\nEscaped Template\n', escapedTemplate);

var unescapedTemplate = escapeDelims.unescape(escapedTemplate);
console.log('\nUnescaped Template matches original?', unescapedTemplate == template);

var data = {
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
var ract = new Ractive({
    template: escapedTemplate,
    data: data,
});
var render_escaped = ract.toHTML();
console.log("\nRendered:", render_escaped);

var unescaped_render = escapeDelims.unescape(render_escaped);
console.log("\nUnescaped Render:", unescaped_render);

// escape
// call app.render (not res.render which returns immediately) to get the rendered HTML
// unescape
