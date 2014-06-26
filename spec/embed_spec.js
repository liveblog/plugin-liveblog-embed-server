/*global describe, beforeEach, expect, it */

var gotoUri = require('./helpers/liveblog_frontend').gotoUri;
var uploadFixtures = require('./helpers/liveblog_fixtures').uploadFixtures;

describe('Embed', function() {
    'use strict';

    describe('itself', function() {
        beforeEach(
            function(done) {
                uploadFixtures(
                    'posts', 10,
                    function (e,r,j) {
                        done();
                    }
                );
                gotoUri('/');
            }
        );

        it('is rendered serverside', function() {
            console.log('here "it" started');
            console.log(protractor.getInstance().params.fixtures);
            expect(true).toBe(true);
        });

    // 'structure' describe end
    });

// 'Tests' root describe end
});
