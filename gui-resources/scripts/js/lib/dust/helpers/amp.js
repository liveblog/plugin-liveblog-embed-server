'use strict';

define(['dust/core'], function(dust) {

    dust.filters.amp = function(string) {
        return string.replace(/<img /g, '<amp-img layout="responsive" ');
    };
    return dust;
});
