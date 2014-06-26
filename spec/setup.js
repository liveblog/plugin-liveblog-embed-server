'use strict';

/*global beforeEach, afterEach */

var resetApp = require('./helpers/liveblog_fixtures').resetApp;

// runs before every spec
beforeEach(function(done) {
    resetApp(function() {done();});
    //done();
});

// runs after every spec
afterEach(function() {});
