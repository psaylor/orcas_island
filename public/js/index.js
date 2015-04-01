$(function() {
console.log("running index.js");
var data = {
    author: 'Trish Saylor',
};

var rendered = $(".jumbotron").html();
if (rendered) {
    r0 = new Ractive({
        el: '0',
        template: $('#0').html(),
        data: {author: 'Patricia Saylor'},
    });
}


});
