'use strict';

var liveblogBackend = require('./liveblog_backend');
var backendRequestAuth = liveblogBackend.backendRequestAuth;

exports.postCreate = function postCreate(postContent, callback) {
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
};

exports.postPublish = function postPublish(postId, callback) {
    backendRequestAuth({
        method: 'POST',
        uri: '/my/LiveDesk/Blog/1/Post/' + postId + '/Publish',
        json: {}
    }, function(e, r, j) {
        callback(e, r, j);
    });
};
