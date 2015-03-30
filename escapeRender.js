var fs = require('fs');
var path = require('path');

var ractiveRender = require('ractive-render');
var _ = require('lodash');
var Promise = require('bluebird');
fs = Promise.promisifyAll(Object.create(fs));

var er = exports;

/**
 * Configuration
 *
 */
er.settings = {};

/**
 * Render the given template or component
 *
 * @param {String} file
 * @param {Object} [options]
 * @param {Function} [callback]
 * @returns {Promise}
 * @public
 */
er.renderFile = function(file, options, callback) {
    console.log("EscapeRender rendering file", file, "with options", options);
    
};