/*global describe, beforeEach, expect, it, element, by */

var gotoUri = require('./helpers/liveblog_frontend').gotoUri;
var uploadFixtures = require('./helpers/liveblog_fixtures').uploadFixtures;

describe('Embed', function() {
    'use strict';

    describe('itself', function() {
        beforeEach(
            function(done) {
                uploadFixtures(
                    'posts', 1,
                    function(e, r, j) {
                        done();
                    }
                );
                gotoUri('/');
            }
        );

        it('is rendered serverside', function() {
            expect(
                element(
                    by.css('div[data-gimme="liveblog-layout"]')
                ).isDisplayed()
            ).toBe(true);
        });

    });

});
