'use strict';

define(['dust/core'], function(dust) {

    dust.filters['amp'] = function(string) {
    	var width, height;
        return string.replace(/\<img /g, '<amp-img layout="responsive" ')
    };
    return dust;
});
