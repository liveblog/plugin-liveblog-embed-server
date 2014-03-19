/* jshint maxparams: 9 */
'use strict';

define([
    'backbone',
    'underscore',
    'plugins',
    'core/utils',
    'dust',
    'core/gettext',
    'core/utils/fixedEncodeURIComponent',
    'core/utils/visibilityToggle',
    'config/social-share-plugin'
], function(Backbone, _, plugins, utils, dust, gt,
    fixedEncodeURIComp, visibilityToggle, shareConf) {

    if (utils.isClient){

        plugins['social-share'] = function(config) {

            utils.dispatcher.on('initialize.post-view', function(view) {
                view.clientEvents({'click .sf-share': 'share'});

                view.share = function(e) {
                    e.preventDefault();

                    if (!view.socialShareBoxAdded) {
                        dust.renderThemed('item/social-share', socialParams(view),
                          function(err, out) {
                            view.$('.sf-share').after(out);
                            view.socialShareBoxAdded = true;
                        });
                    }

                    var socialShareBox = view.$('[data-gimme="post.share-social"]');
                    var postShare = view.$('[data-gimme^="post.share"]');
                    if (socialShareBox.css('visibility') === 'hidden') {
                        visibilityToggle(postShare, false);
                    }
                    visibilityToggle(socialShareBox);
                };
            });

            // Construct the window containing the social sharing links
            Backbone.$.socialShareWindow = function(url, height, width) {
                var options = 'resizable, height=' + height + ', width=' + width;
                var socialShareWindow = window.open(url, '', options);
                socialShareWindow.focus();
                return false;
            };

            // Return the parameters to construct the social sharing urls
            var socialUrlParams = function(view) {
                var blog      = view.parent().parent().model,
                    blogTitle = fixedEncodeURIComp(blog.get('Title')),
                    summary   = fixedEncodeURIComp(
                                view.$('.result-content .result-text:last').text());

                var permLink  = '';
                if (view.permalink && typeof view.permalink === 'function') {
                    permLink  = fixedEncodeURIComp(view.permalink());
                }

                var imgsrc    = view.$('.result-content img:first').attr('src');
                if (!imgsrc) {
                    imgsrc = Backbone.$('img:first').attr('src');
                }

                var fbURLImageComp = '';
                view.$('.result-content img').each(function(index) {
                    fbURLImageComp += gt.sprintf(shareConf.fbURLImageComp,
                                        [index, Backbone.$(this).attr('src')]);
                });

                var urlParams = {
                    pin:   [permLink, imgsrc, blogTitle],
                    twt:   [gt.gettext('Now reading'), blogTitle, permLink],
                    lin:   [permLink, blogTitle, summary],
                    ggl:   [permLink],
                    email: [gt.gettext('Check out this Live Blog'), permLink],
                    fb:    [blogTitle, summary, permLink, fbURLImageComp]
                };

                return urlParams;
            };

            // Return the parameters for the social sharing template
            var socialParams = function(view) {

                var params = {},
                    urlParams = socialUrlParams(view);

                params.emailurl =  gt.sprintf(shareConf.urls.email, urlParams.email);
                _.each(urlParams, function(value, key) {
                    var url = gt.sprintf(shareConf.urls[key], urlParams[key]);
                    params[key + 'click'] =
                        gt.sprintf('$.socialShareWindow("%s",%u,%u); return false;',
                            [url, shareConf.shareWindowSize[key].h,
                                  shareConf.shareWindowSize[key].w]);
                });

                return params;
            };
        };
    }
});
