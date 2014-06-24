'use strict';

var liveblogCommon = require('./liveblog_common');
var backendRequestAuth = liveblogCommon.backendRequestAuth;

exports.postPublish = function postPublish(postId, callback) {
    backendRequestAuth({
        uri: '/my/LiveDesk/Blog/1/Post/' + postId + '/Publish',
        method: 'POST'
    }, function(e, r, j) {
        callback(e, r, j, postId);
    });
};

exports.postCreate = function postCreate(postContent, callback) {
    backendRequestAuth({
        uri: '/my/LiveDesk/Blog/1/Post',
        method: 'POST',
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
