'use strict';
define(['dustjs-linkedin', 'core/utils/twitter'], function(dust, twitter){

    var truncateString = function(string, n, useWordBoundary) {
        var tooLong = string.length > n,
            s_ = tooLong ? string.substr(0, n-1) : string;
        s_ = useWordBoundary && tooLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
        return tooLong ? s_ + '...' : s_;
    };

    var getAnnotation = function(idx) {
        return function(content) {
            try {
                content = JSON.parse(content);
                return content.annotation[idx];
            }
            catch(e){}
            return '';
        };
    };

    // TODO: Remove filters from here once dust-helpers are integrated
    // TODO: Commented next filter because it requires jQuery, make it work
    //dust.filters.t = function(string){ return $('<div>'+string+'</div>').text(); };
    dust.filters.trim50 = function(string){ return truncateString(string, 50, true); };
    dust.filters.trim150 = function(string){ return truncateString(string, 150, true); };
    dust.filters.trim200 = function(string){ return truncateString(string, 200, true); };
    dust.filters.twitter_all = function(string) { return twitter.link.all(string); };
    dust.filters.twitter_annotation_before = getAnnotation(0);
    dust.filters.twitter_annotation_after = getAnnotation(1);

    return dust;
});
