'use strict';
define([
    'plugins',
    'core/utils'
], function(plugins, Utils){
    
    plugins.test = function(config) {
        
        Utils.dispatcher.on('initialize.blog-view', function(BlogView){

            BlogView.clientEvents['click #liveblog-test'] = 'testEvent';
            BlogView.testEvent = function() {
                console.log('Test triggered');
            };
        });
        Utils.dispatcher.once('after-render.blog-view', function(BlogView){
            BlogView.$el.prepend('<div id="liveblog-test">Click for test</div>');
        });
    };
    return plugins.test;
});
