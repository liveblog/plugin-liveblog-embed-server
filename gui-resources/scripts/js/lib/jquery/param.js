define(['jquery'], function($) {
    $.param = function(obj) {
        var paramStr = "";
        $.each(obj, function(key, value) {
            paramStr += '&' + key + '=' + encodeURIComponent(JSON.stringify(value)).replace(/%3A/g, ':').replace(/%2C/g, ',');
        });
        return paramStr.substr(1);
    }
});
