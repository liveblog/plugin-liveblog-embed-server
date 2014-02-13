'use strict';
define(['dustjs-linkedin'], function(dust){
    // TODO: Remove filters from here once dust-helpers are integrated
    dust.filters.twitter_all = function(string) { return string; };
    return dust;
});
