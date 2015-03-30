var Ractive = Ractive || require('ractive');

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
var j = JSON.stringify(data);
console.log(j);
console.log('\n');

var ultimateData = {
    fragNum: 3,
    isFocused: function (n) {
        return n === 3;
    },
    recording: false,
    isRecording: function (n) {
        return false;
    },
    playbackReady: function (n) {
        return false;
    },
};

var options = {
    delimiters: ['[[', ']]'],
    // delimiters: ['{{', '}}'],
};

var doUlt1 = function(ultimateTemplate) {
  console.log('\nGot Ultimate Template:', ultimateTemplate);

  var ul = new Ractive({
      template: ultimateTemplate,
      el: 'c5',
      delimiters: options.delimiters,
      data: ultimateData,
  });
  console.log("\nUltimate Rendered:", ul.toHTML());

  var dbl_render = new Ractive({
      template: ul.toHTML(),
      el: 'c6',
      data: ultimateData,
  });
  console.log("\nSecond Rendering:", dbl_render.toHTML());

  var parsedUltimate = Ractive.parse(ultimateTemplate);
  // console.log("\nParsed ultimate file:", flatten(parsedUltimate));
  var render_parsed = new Ractive({
      template: parsedUltimate,
      el: 'c7',
      data: data,
  });
  console.log("\nRender of pre-parsed ultimate:", render_parsed.toHTML());
};

if (! __dirname) {
  console.log("Jquery Client");
  var req = $.get('fragment.html', doUlt1);
} else {
  console.log("node.js");
  var fs = require('fs');
  fs.readFile('fragment.html', {encoding: 'utf8'}, function(err,data) {
    doUlt1(data);
  });
}




//Mustache-only template
var ult2 = '<div class="panel panel-default {{#if isFocused(fragNum)}}focused{{/if}}" on-mouseenter="hover" on-mouseleave="unhoverPanel" onclick="clicker" data-fragment="{{fragNum}}"> <button type="button" class="btn btn-default record-btn {{#if isRecording(fragNum) }} btn-danger {{else}} btn-primary {{/if}}" on-click="toggleRecord" data-fragment={{fragNum}} disabled="{{recording && !isRecording(fragNum)}}"> {{#if isRecording(fragNum)}} <i class="fa fa-stop"></i> Stop {{else}} <i class="fa fa-dot-circle-o"></i> Record {{/if}} </button> <button type="button" class="btn btn-success play-btn" data-fragment="{{fragNum}}" disabled="{{playbackReady(fragNum)}}"> <i class="fa fa-play"></i> Play </button> </div>';

// can escape quote literals inside a string with backslash \

// console.log('\nUltimate Mustache:', ult2);
var ul2 = new Ractive({
    template: ult2,
    data: ultimateData,
});
var parsedUlt = Ractive.parse(ult2);
// console.log("\nParsed:", flatten(parsedUlt));
// console.log("\nUltimate Mustache Rendered:", ul2.toHTML());

var ul3 = new Ractive({
    template: parsedUlt,
    el: 'c8',
    data: ultimateData
});