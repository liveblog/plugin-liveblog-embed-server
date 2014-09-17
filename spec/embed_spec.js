/*global describe, beforeEach, expect, it, element, by */

var randomText = require('./helpers/utils.js').UUIDv4;
var gotoUri = require('./helpers/liveblog_frontend').gotoUri;
var uploadFixtures = require('./helpers/liveblog_fixtures').uploadFixtures;
var liveblogBackend = require('./helpers/liveblog_posts.js');
var postCreateAndPublish = liveblogBackend.postCreateAndPublish;
var postEdit = liveblogBackend.postEdit;
var postDelete = liveblogBackend.postDelete;

// Protractor Params:
var pp = protractor.getInstance().params;

describe('Embed', function() {
    'use strict';

    describe(' (when have one post)', function() {
        beforeEach(function(done) {
            uploadFixtures('posts', 1, function(e, r, j) {
                gotoUri('/', function() {
                    done();
                });
            });
        });

        it(' is rendered serverside', function() {
            expect(
                element(by.css('div[data-gimme="liveblog-layout"]'))
                .isDisplayed()
            ).toBe(true);
        });

    //describe
    });

    describe(' (when blank)', function() {
        beforeEach(function(done) {
            uploadFixtures('posts', 0, function(e, r, j) {
                gotoUri('/', function() {
                    done();
                });
            });
        });

        it(' is updating to show just added post', function() {
            var postContent = randomText();
            postCreateAndPublish({
                postContent: postContent
            });
            browser.wait(
                function() {
                    return browser.isElementPresent(
                        by.cssContainingText(
                            'div.liveblog-content p.post-text',
                            postContent
                    ));
                },
                pp.maxTimeout,
                'Just added post should appear on page.'
            );
        },
        //it
        pp.maxTimeout);

        it(' is updating to show just edited post', function() {
            var postContent = randomText(),
                newContent = randomText(),
                postId;
            postCreateAndPublish({
                postContent: postContent
            }, function(e, r, j, id) {
                postId = id;
            });
            browser.wait(
                function() {
                    return browser.isElementPresent(
                        by.cssContainingText(
                            'div.liveblog-content p.post-text',
                            postContent
                    ));
                },
                pp.maxTimeout,
                'Just added post should appear on page.'
            ).then(function() {
                postEdit({
                    postId: postId,
                    newContent: newContent
                });
                browser.wait(
                    function() {
                        return browser.isElementPresent(
                            by.cssContainingText(
                                'div.liveblog-content p.post-text',
                                newContent
                            )
                        );
                    },
                    pp.maxTimeout,
                    'Just edited post should be updated on page.'
                );
            });
        },
        //it
        pp.maxTimeout * 2);

        it(' is updating to show just deleted post', function() {
            var postContent = randomText(),
                postId;
            postCreateAndPublish({
                postContent: postContent
            }, function(e, r, j, id) {
                postId = id;
            });
            browser.wait(
                function() {
                    return browser.isElementPresent(
                        by.cssContainingText(
                            'div.liveblog-content p.post-text',
                            postContent
                    ));
                },
                pp.maxTimeout,
                'Just added post should appear on page.'
            ).then(function() {
                postDelete({
                    postId: postId
                });
                browser.wait(
                    function() {
                        return element.all(
                            by.cssContainingText(
                                'div.liveblog-content p.post-text',
                                postContent
                            )
                        ).count().then(
                            function(count) {
                                return count === 0;
                            }
                        );
                    }, pp.maxTimeout,
                    'Just deleted post should disappear from page.'
                );
            });
        },
        //it
        pp.maxTimeout * 2);

    //describe
    });

//describe Embed
});
