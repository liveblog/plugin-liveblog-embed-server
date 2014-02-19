'use strict';

define(['dust/core'], function(dust){
    
    dust.defined = function(name) {
        return dust.cache[name]? true : false;
    };
    return dust;
});