'use strict';

define(['dust/core','dust/defined'], function(dust){
    
    dust.themed = function(name) {
        var themeBase = name, theme;
        if(name.indexOf('themeBase/') !== -1) {
            theme = name.replace('themeBase/','theme/');
        }
        if(dust.defined(theme)) {
            return theme;
        }
        return themeBase;
    };
    return dust;
});