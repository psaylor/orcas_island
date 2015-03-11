var Ractive = require('ractive');
var path = require('path');

var ractive = new Ractive({
    template: 'hello from {{who}}'
});

ractive.set('who', 'node');
console.log(ractive.toHTML());