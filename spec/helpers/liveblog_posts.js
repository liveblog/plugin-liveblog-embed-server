'use strict';

var liveblogBackend = require('./liveblog_backend');
var backendRequestAuth = liveblogBackend.backendRequestAuth;

var utils = require('./utils');
var getIdFromHref = utils.getIdFromHref;

exports.postCreate = postCreate;
exports.postPublish = postPublish;
exports.postCreateAndPublish = postCreateAndPublish;

function postCreate(postContent, callback) {
    backendRequestAuth({
        method: 'POST',
        uri: '/my/LiveDesk/Blog/1/Post',
        json: {
            'Meta': {},
            'Content': postContent,
            'Type': 'normal',
            'Creator': '1'
        }
    }, function(e, r, j) {
        callback(e, r, j);
    });
}

function postPublish(postId, callback) {
    backendRequestAuth({
        method: 'POST',
        uri: '/my/LiveDesk/Blog/1/Post/' + postId + '/Publish',
        json: {}
    }, function(e, r, j) {
        callback(e, r, j);
    });
}

function postCreateAndPublish(postContent, callback) {
    postCreate(postContent, function(e, r, json) {
        var id = getIdFromHref(json.href);
        postPublish(
            id,
            function(e,r,j) {
                callback(e,r,j, id);
            });
    });
}
