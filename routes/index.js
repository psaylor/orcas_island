var express = require('express');
var router = express.Router();

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', 
    {
        author: 'Patricia Saylor',
        stories: stories,
    });
});

module.exports = router;
