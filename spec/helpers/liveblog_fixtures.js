'use strict';

/*global protractor, jasmine */

var utils = require('./utils');
var getIdFromHref = utils.getIdFromHref;

var getToken = require('./liveblog_auth').getToken;

var liveblogBackend = require('./liveblog_backend');
var backendRequest = liveblogBackend.backendRequest;

var liveblogPosts = require('./liveblog_posts.js');
var postCreate = liveblogPosts.postCreate;
var postPublish = liveblogPosts.postPublish;

exports.resetApp = resetApp;
exports.uploadFixtures = uploadFixtures;

function resetApp(callback) {
    backendRequest({
        uri: '/Tool/TestFixture/default',
        method: 'PUT',
        json: {
            'Name': 'default',
            'ApplyOnDatabase': true,
            'ApplyOnFiles': true
        }
    }, function(e, r, j) {
        getToken(function(e2, r2, j2) {
            callback(e, r, j);
        });
    });
}

function uploadFixtures(name, number, callback) {
    number = number || 1;
    var results = {},
        counter = 0,
        i,
        fixtureFunction,
        fixtureFunctions,
        inProgressCallback = function(e, r, j) {
            // raising the number of uploaded fixtures:
            counter++;
            // and then all the fixtures were uploaded:
            if (counter === number) {
                protractor.getInstance().params.fixtures = results;
                callback(e, r, j);
            }
        };

    fixtureFunctions = {
        'posts': function(index) {
            index = index + 1; // for readability
            postCreate('test_' + index, function(e, r, json) {
                var id = getIdFromHref(json.href);
                results[index] = id;
                postPublish(id, inProgressCallback);
            });
        }
    };

    fixtureFunction = fixtureFunctions[name];
    if (!fixtureFunction){
        throw new Error('No fixtures for "' + name + '".\n' +
                        'Available fixtures:\n' +
                        jasmine.pp(Object.keys(fixtureFunctions)));
    }

    // let's do it!
    resetApp(function(e, r, b) {
        for (i = 0; i < number; i++) {
            fixtureFunction(i);
        }
    });
}
