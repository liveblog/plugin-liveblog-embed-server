'use strict';

define(['dust/core'], function(dust){

    dust.helpers.msg = function( chunk, context, bodies, params ){
        chunk.write(params.text);
        return chunk;
    };
    return dust;
});
