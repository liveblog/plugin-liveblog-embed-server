'use strict';
define(['dust/core', 'core/utils/twitter'], function(dust, twitter){

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

    dust.filters.twitter_all = function(string) { return twitter.link.all(string); };
    dust.filters.twitter_annotation_before = getAnnotation(0);
    dust.filters.twitter_annotation_after = getAnnotation(1);

    return dust;
});
