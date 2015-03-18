module.exports = function(template, cb){
    console.log("Running layout.js");
    var context = this;
    console.log(context);
    var stories = [
        {
            title: 'The Father and the Sons',
            link: './stories/the_father_and_sons',
            image: './images/aesop.jpg',
        },
        {
            title: 'The Lion and the Mouse',
            link: './stories/the_lion_and_mouse',
            image: './images/the_lion_and_mouse.jpg',
        },
        {
            title: 'The Madman Who Sold Wisdom',
            link: './stories/the_madman_who_sold_wisdom',
            image: './images/aesop.jpg',
        },
        {
            title: 'The North Wind and the Sun',
            link: './stories/the_north_wind',
            image: './images/aesop.jpg',
        },
        {
            title: 'The Oak and the Reeds',
            link: './stories/the_oak_and_reeds',
            image: './images/the_oak_and_reeds.jpg',
        },
        {
            title: 'The Thrush and the Swallow',
            link: './stories/the_thrush_and_swallow',
            image: './images/the_thrush_and_swallow.jpg',
        },
        {
            title: 'The Traveler and The Dog',
            link: './stories/the_traveler_and_dog',
            image: './images/aesop.jpg',
        },
        {
            title: 'The Trees and the Axe',
            link: './stories/the_trees_and_axe',
            image: './images/the_trees_and_axe.jpg',
        },
    ];
    var data = {
        author: 'Patricia Saylor',
        stories: stories,
    };

    var init = function(options) {
        var self = this;
        console.log("init called");
        self.update('stories');
    };

    var partial_names = ['nav', 'story_thumbnails', 'index'];
    var component_names = [];

    console.log("Getting partials for: ", partial_names);

    context.getResources(partial_names, component_names, function(error, partials, components){
        if (error) {
            cb(error); 
            return;
        }
        console.log("Got partials:", partials);
        console.log("working with data:", data);
        console.log("working with template:", template);
        cb(null, context.Ractive.extend(
            {
                template: template, 
                partials: partials, 
                components: components, 
                data: data, 
                init: init
            }));
    });
};