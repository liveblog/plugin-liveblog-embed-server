'use strict';

define([
    'css!theme/liveblog',
    'plugins/button-pagination',
    'plugins/twitter-widgets',
    'plugins/post-hash',
    'plugins/permanent-link',
    'plugins/social-share',
    'plugins/wrappup-toggle',
    'plugins/user-comments',
    'plugins/status',
    'tmpl!theme/container',
    'tmpl!theme/item/base',
    'tmpl!theme/plugins/permanent-link'
], function() {
    return {
        plugins: [
            'button-pagination',
            'twitter-widgets',
            'post-hash',
            'permanent-link',
            'social-share',
            'wrappup-toggle',
            'user-comments',
            'status'
        ]
    };
});
