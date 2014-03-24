/* jshint maxcomplexity: false */
'use strict';

define([
    'models/base-model'
], function(BaseModel) {

    return BaseModel.extend({
        initialize: function() {
            this.set(liveblog);
        }
    });
});
