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
    'config/social-share-plugin'
], function(Backbone, _, plugins, utils, dust, gt, fixedEncodeURIComp, shareConf) {

    if (utils.isClient){

        plugins['social-share'] = function(config) {

            Backbone.$.socialShareWindow = function(url, height, width) {
                var options = 'resizable, height=' + height + ', width=' + width;
                var socialShareWindow = window.open( url, '', options);
                socialShareWindow.focus();
                return false;
            };

            utils.dispatcher.on('initialize.post-view', function(view) {
                view.events['click .sf-share'] = 'share';

                view.share = function(e) {
                    e.preventDefault();

                    if (!view.socialShareBoxAdded) {
                        var blog      = view.parent().parent().model,
                            blogTitle = fixedEncodeURIComp(blog.get('Title')),
                            summary   = fixedEncodeURIComp(
                                        view.$('.result-content .result-text:last').text()),
                            permLink  = '',
                            imgsrc    = view.$('.result-content img:first').attr('src');
                        if (!imgsrc) {
                            imgsrc = Backbone.$('img:first').attr('src');
                        }
                        if (view.permalink && typeof view.permalink === 'function') {
                            permLink  = fixedEncodeURIComp(view.permalink());
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

                        var socialParams = {
                            'emailurl': gt.sprintf(shareConf.urls.email, urlParams.email)
                        };
                        _.each(urlParams, function(value, key) {
                            var url = gt.sprintf(shareConf.urls[key], urlParams[key]);
                            socialParams[key + 'click'] =
                                gt.sprintf('$.socialShareWindow("%s",%u,%u); return false;',
                                    [url, shareConf.shareWindowSize[key].h,
                                          shareConf.shareWindowSize[key].w]);
                        });

                        dust.renderThemed('item/social-share', socialParams, function(err, out) {
                            view.$('.sf-share').after(out);
                            view.socialShareBoxAdded = true;
                        });
                    }

                    var socialShareBox = view.$('[data-gimme="post.share-social"]');
                    if(socialShareBox.css('visibility') === 'visible') {
                        socialShareBox.css('visibility', 'hidden' );
                    } else {
                        view.$('[data-gimme^="post.share"]').css('visibility', 'hidden');
                        socialShareBox.css('visibility', 'visible' );
                    }
                };
            });
        };
    }
});
