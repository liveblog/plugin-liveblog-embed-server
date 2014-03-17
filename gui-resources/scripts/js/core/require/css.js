/*jshint -W030 */
/*jshint unused: false*/
'use strict';

define(['core/utils', 'plugins/css', 'backbone'], function(utils, pluginCss, Backbone) {
    var cssAPI = {};
    
    cssAPI.normalize = function(name, normalize) {
        if (name.substr(name.length - 4, 4) === '.css') {
            name = name.substr(0, name.length - 4);
        }
        return normalize(name);
    };
    
    cssAPI.pluginBuilder = './css-builder';
    
    if(utils.isClient) {
        
        var head = document.getElementsByTagName('head')[0],

            engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)/) || 0;

        // use <style> @import load method (IE < 9, Firefox < 18)
        var useImportLoad = false;
      
        // set to false for explicit <link> load checking when onload doesn't work perfectly (webkit)
        var useOnload = true;

        // trident / msie
        if (engine[1] || engine[7]) {
            useImportLoad = parseInt(engine[1],10) < 6 || parseInt(engine[7],10) <= 9;
        }
        // webkit
        else if (engine[2]) {
            useOnload = false;
        }
        // gecko
        else if (engine[4]) {
            useImportLoad = parseInt(engine[4],10) < 18;
        }

        // <style> @import load method
        var curStyle, curSheet;
        var createStyle = function () {
            curStyle = document.createElement('style');
            head.appendChild(curStyle);
            curSheet = curStyle.styleSheet || curStyle.sheet;
        };
        var ieCnt = 0;
        var ieLoads = [];
        var ieCurCallback;
      
        var createIeLoad = function(url) {
            ieCnt++;
            if (ieCnt === 32) {
                createStyle();
                ieCnt = 0;
            }
            curSheet.addImport(url);
            curStyle.onload = processIeLoad;
        };
        var processIeLoad = function() {
            ieCurCallback();
     
            var nextLoad = ieLoads.shift();
     
            if (!nextLoad) {
                ieCurCallback = null;
                return;
            }
     
            ieCurCallback = nextLoad[1];
            createIeLoad(nextLoad[0]);
        };
        var importLoad = function(url, callback) {
            
            if (!curSheet || !curSheet.addImport) {
                createStyle();
            }

            if (curSheet && curSheet.addImport) {
                // old IE
                if (ieCurCallback) {
                    ieLoads.push([url, callback]);
                }
                else {
                    createIeLoad(url);
                    ieCurCallback = callback;
                }
            }
            else {
                // old Firefox
                curStyle.textContent = '@import "' + url + '";';

                var loadInterval = setInterval(function() {
                    try {
                        curStyle.sheet.cssRules;
                        clearInterval(loadInterval);
                        callback();
                    } catch(e) {}
                }, 10);
            }
        };

        var linkLoad = function(url, callback) {
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            if (useOnload) {
                link.onload = function() {
                    link.onload = function() {};
                    // for style dimensions queries, a short delay can still be necessary
                    setTimeout(callback, 7);
                };
            }
            else {
                var loadInterval = setInterval(function() {
                    for (var i = 0; i < document.styleSheets.length; i++) {
                        var sheet = document.styleSheets[i];
                        if (sheet.href === link.href) {
                            clearInterval(loadInterval);
                            return callback();
                        }
                    }
                }, 10);
            }
            link.href = url;
            head.appendChild(link);
        };

    }
  
    cssAPI.load = function(name, req, onload, config) {
        var configCss = config.config.css;
        if(utils.isServer) {
            var path = require('path'),
            // calculate the base folder of the file
            fileBase = configCss.siteRoot? path.join(config.baseUrl,configCss.siteRoot) : config.baseUrl,
            // get the relative path from the file base
            relativePath = path.relative(fileBase, req.toUrl(name+'.css')),
            // url should be formated from the css configuration host and relativePath
            url = configCss.host + '/' + relativePath;
            pluginCss.setData('<link type="text/css" rel="stylesheet" href="'+url+'">');
            onload();
        }
        if(utils.isClient) {
            var loaded = Backbone.$('link[href="'+req.toUrl(configCss.host + '/' + name+'.css')+'"]');
            (useImportLoad ? importLoad : linkLoad)(req.toUrl(name + '.css'), onload);
            // @TODO uncomment the lines below when main view is defined
            //if(!loaded) {
            //    (useImportLoad ? importLoad : linkLoad)(req.toUrl(name + '.css'), onload);
            //} else {
            //    onload();
            //}
        }
    };

    return cssAPI;
});