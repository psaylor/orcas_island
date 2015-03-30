$(function() {
console.log("running index.js");
var data = {
    author: 'Trish Saylor',
};

var rendered = $(".jumbotron").html();
console.log("Ractive-rendered", rendered);
if (rendered) {
    r0 = new Ractive({
        el: '0',
        template: $('#0').html(),
        data: {author: 'Patricia Saylor'},
    });
}


});
