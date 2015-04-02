/* jshint maxcomplexity: false */
/* jshint maxstatements: false */
'use strict';

define([
    'underscore',
    'models/base-model'
], function(_, BaseModel) {

    return BaseModel.extend({
        syncParams: {
            headers: {
                'Authorization': liveblog.auth
            }
        },
        urlRoot: function() {
            return liveblog.servers.rest + '/users';
        },
        parse: function(data) {
            return data;
        }
    });
});
