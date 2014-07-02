/*global describe, beforeEach, expect, it, element, by */

var gotoUri = require('./helpers/liveblog_frontend').gotoUri;
var uploadFixtures = require('./helpers/liveblog_fixtures').uploadFixtures;
var resetApp = require('./helpers/liveblog_fixtures.js').resetApp;
var postCreateAndPublish = require('./helpers/liveblog_posts.js').postCreateAndPublish;

var maxTimeout = 120000;

describe('Embed', function() {
    'use strict';

    describe(' (when have one post)', function() {
        beforeEach(
            function(done) {
                uploadFixtures(
                    'posts', 1,
                    function(e, r, j) {
                        gotoUri('/', function() {
                            done();
                        });
                    }
                );
            }
        );

        it(' is rendered serverside', function() {
            expect(
                element(
                    by.css('div[data-gimme="liveblog-layout"]')
                ).isDisplayed()
            ).toBe(true);
        });

    });

    describe(' (when blank)', function() {
        beforeEach(
            function(done) {
                resetApp(function(e, r, j) {
                    gotoUri('/', function() {
                        done();
                    });
                });
            }
        );

        it(' is updates to show just added post',
            function() {
                postCreateAndPublish('test123', function() {});
                console.log('[POST] published:');
                console.log(Date());
                browser.wait(
                    function() {
                        return browser.isElementPresent(
                            by.cssContainingText(
                                'div.liveblog-content p.post-text',
                                'test123'
                            )
                        );
                    },
                    maxTimeout
                ).then(
                    function() {
                        element(
                            by.cssContainingText(
                                'div.liveblog-content p.post-text',
                                'test123'
                            )
                        ).getText().then(
                            function(t) {
                                console.log(t);
                                console.log('[POST] displayed:');
                                console.log(Date());
                            }
                        );
                    }
                );

                expect(
                    element(
                        by.cssContainingText(
                            'div.liveblog-content p.post-text',
                            'test123'
                        )
                    ).isPresent()
                ).toBe(true);
            },
            maxTimeout
        );

    });

});
