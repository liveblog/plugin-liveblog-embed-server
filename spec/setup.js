'use strict';

/*global beforeEach, afterEach */

var resetApp = require('./helpers/liveblog_fixtures').resetApp;

// runs before every spec
beforeEach(function(done) {
    //resetApp(done);
    var uploadSmthsFixtures = require('./helpers/liveblog_fixtures').uploadPostFixtures;
    uploadSmthsFixtures(done, 2);
});

// runs after every spec
afterEach(function() {});
