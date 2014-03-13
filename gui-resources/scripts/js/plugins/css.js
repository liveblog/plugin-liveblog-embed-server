'use strict';

define([
    'plugins',
    'core/utils'
], function(plugins, utils){
    var obj = function(config) {
        if(obj.hasData()) {
            utils.dispatcher.once('after-render.blog-view', function(view){
                view.$el.prepend(obj.getData());
            });
        }
    };
    obj._data = '';
    obj.setData = function(data){
        obj._data = data;
    };
    obj.getData = function(){
        return obj._data;
    };
    obj.hasData = function(){
        return (obj._data !== '') ? true: false;
    };
    plugins.css = obj;
    return plugins.css;
});
