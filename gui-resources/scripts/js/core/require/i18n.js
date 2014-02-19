'use strict';

define(['core/utils/json-call', 'core/gettext'], function(jsonCall, gt){
    
    var buildMap = {};
        // apiUrl = liveblog.frontendServer,
        // langCode = liveblog.language;
    //API
    return {

        load: function(name, req, onLoad, config) {
            jsonCall(liveblog.host + '/content/cache/locale/plugin-livedesk_embed-de.json',
                function(data) {
                    gt.loadMessages(data.livedesk_embed );
                    if (config.isBuild) {
                        buildMap[name] = gt;
                    }
                    onLoad(gt);
                });
        },
        write: function(pluginName, moduleName, write){
            if(moduleName in buildMap){
                var content = buildMap[moduleName];
                write('define("'+ pluginName +'!'+ moduleName +'", function(){ return '+ content +';});\n');
            }
        }

    };
});
