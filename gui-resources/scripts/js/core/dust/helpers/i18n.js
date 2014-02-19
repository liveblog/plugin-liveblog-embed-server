'use strict';

define(['dust/core', 'core/gettext'], function(dust, gt){

    dust.helpers.i18n = function( chunk, context, bodies, params ){
        if( params && params.msgid ){
            var msgid = params.msgid;
            delete params.msgid;
            var text = gt.dcnpgettext(params.domain, params.msgctxt, msgid, params.msgid_plural, params.n);
            chunk.write(text);
            //chunk.write(i18n.dcnpgettext(params.domain, params.msgctxt, params.msgid, params.msgid_plural, params.n).format(parseAttributeParams(chunk, context, bodies, params)));
        }
        else {
            if( console ){
                console.log( 'No expression given!' );
            }
        }
        return chunk;
    };
    return dust;
});