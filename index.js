var Ractive = Ractive || require('ractive');


var template = '<button type="button" class="btn record-btn \
{{ isRecording(fragNum) ? "btn-danger" : "btn-primary" }}" \
    on-click="toggleRecord"\
    data-fragment="((fragNum))"\
    disabled="{{ recording && !isRecording(fragNum) }}">\
    {{#if isRecording(fragNum)}}\
      <i class="fa fa-stop"></i> Stop\
    {{else}}\
      <i class="fa fa-dot-circle-o"></i> Record\
    {{/if}}\
    Mustache Frag {{ mFragNum }}\
    Square Frag ((sFragNum)) \
    </button>';

var simpleTemplate = '<button> M:{{mFragNum}} S:[[sFragNum]]</button>';
var slightlyMore = '<button class=" {{mFragNum}} [[sFragNum]] "> M:{{mFragNum}} S:[[sFragNum]]</button>';

var evenMore = '<div data-fragment=[[fragNum]] data-mfrag={{mFragNum}}>\
M:{{mFragNum}} S:[[sFragNum]]\
</div>';

var mightBreak = '<div data-sfrag="[[sFragNum]]" data-mfrag="{{mFragNum}}">\
M:{{mFragNum}} S:[[sFragNum]]</div>';
var options = {
    delimiters: ['[[', ']]'],
    // delimiters: ['{{', '}}'],
};
var data = {
    fragNum: 3,
    mFragNum: 4,
    sFragNum: 5,
    isRecording: function(n) {
        return n === 5;
    },
}

console.log("Rendering data", data);
// var ra = new Ractive({
//     template: template,
//     delimiters: options.delimiters,
//     data: data,
// });

// console.log("Ractive:", ra.toHTML());

var ras = new Ractive({
    template: simpleTemplate,
    el: 'c1',
    delimiters: options.delimiters,
    data: data,
});
console.log("Simpler:", ras.toHTML());

var slight = new Ractive({
    template: slightlyMore,
    el: 'c2',
    delimiters: options.delimiters,
    data: data,
});

console.log("Slightly more complex:", slight.toHTML());

var evenT = new Ractive({
    template: evenMore,
    el: 'c3',
    delimiters: options.delimiters,
    data: data,
});
console.log("Even more complex:", evenT.toHTML());

var breaker = new Ractive({
    template: mightBreak,
    el: 'c4',
    delimiters: options.delimiters,
    data: data,
});
console.log("Breaker?:", breaker.toHTML());
