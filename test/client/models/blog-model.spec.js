// TODO: Set a different jshint config for tests and remove the next lines
/*global describe, it, before, beforeEach, after, afterEach, expect */
/*jshint unused: false, -W030, -W024 */
'use strict';

define(['underscore', 'models/blog'], function(_, Blog) {
    describe('Model blog', function() {
        describe('parse', function() {
            it('parse received data', function() {
                var blog = new Blog(),
                    blogData,
                    embedConfigData = {
                        Id: 1,
                        EmbedConfig: '{"UserComments": true, "FrontendServer": "//localhost:8080"}'
                    },
                    data = {
                        Title: 'test title'
                    };
                blogData = blog.parse(data);
                expect(blogData.Id).to.equal(undefined);
                expect(blogData.Title).to.equal('test title');
                expect(_.isEmpty(blogData.EmbedConfig)).to.equal(true);
                blogData = blog.parse(embedConfigData);
                expect(blogData.Id).to.equal(1);
                expect(blogData.EmbedConfig.UserComments).to.equal(true);
                expect(blogData.EmbedConfig.FrontendServer).to.equal('//localhost:8080');
            });
        });
        describe('urlRoot', function() {
            it('get urlRoot for blog model', function() {
                var blog = new Blog();
                window.liveblog = {
                    servers: {
                        rest: '//localhost:8080'
                    }
                };
                expect(blog.urlRoot()).to.equal('//localhost:8080/resources/LiveDesk/Blog/');
            });
        });
        describe('initialize', function() {
            it('initialize for blog model with publishedPosts data', function() {
                var blog = new Blog({Id: 2});
                expect(blog.get('publishedPosts').blogId).to.equal(2);
            });
        });
    });
});
