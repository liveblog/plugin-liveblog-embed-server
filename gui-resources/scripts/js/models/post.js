/* jshint maxcomplexity: false */
'use strict';

define([
    'models/baseModel',
    'core/utils/helpers',
    'moment'
], function(BaseModel, helpers, moment) {

    return BaseModel.extend({

        parse: function(data) {
            if (data.Meta) {
                data.Meta = JSON.parse(data.Meta);

                if (data.AuthorName) {
                    data.Meta.Creator = { 'Name': data.AuthorName };
                }

                if (data.Meta.annotation) {
                    data.Meta.annotation = this._manageAnnotations(data.Meta.annotation);
                }
            }


            if (data.Author.Source.Type.Key === 'smsblog') {
                data.item = 'source/sms';
            } else {
                if (data.Author.Source.IsModifiable ===  'True' ||
                        data.Author.Source.Name === 'internal') {
                    data.item = 'posttype/' + data.Type.Key;
                }
                else if (data.Type) {
                    data.item = 'source/' + data.Author.Source.Name;
                }
            }

            // TODO: move this to a dust filter
            if (data.CreatedOn) {
                var createdOn = moment(data.CreatedOn);
                // TODO: use locale for date format
                // & !! check that the content of _('post-date') makes sense for moment.js
                //data.CreatedOn = createdOn.format(_('post-date'));
                data.CreatedOn = createdOn.format('DD/MM/YYYY HH:mm');
                data.CreatedOnISO = createdOn.valueOf();
            }

            // TODO: move this to a dust filter
            if (data.PublishedOn) {
                var publishedOn = moment(data.PublishedOn);
                // TODO: use locale for date format
                // & !! check that the content of _('post-date') makes sense for moment.js
                //data.PublishedOn = publishedOn.format(_('post-date'));
                data.PublishedOn = publishedOn.format('DD/MM/YYYY HH:mm');
                data.PublishedOnISO = publishedOn.valueOf();
            }

            // TODO: We may need to use these lines to update the admin server
            //if (data.Content && liveblog && liveblog.adminServer && livedesk && livedesk.frontendServer) {
                //data.Content = data.Content.replace(liveblog.adminServer, livedesk.frontendServer);
            //}

            if (liveblog && liveblog.frontendServer) {
                data.frontendServer = liveblog.frontendServer;
            }

            return data;
        },

        _manageAnnotations: function(apiAnnotation) {
            var annotation = apiAnnotation;

            if (annotation) {
                if (annotation[1] === null) {
                    annotation = annotation[0];
                    annotation = helpers.trimTag(['<br>', '<br />'], annotation);
                }
                if (typeof annotation !== 'string') {
                    if (annotation[0]) {
                        var aux = annotation;
                        annotation = {
                            'before': helpers.trimTag(['<br>', '<br />'], aux[0]),
                            'after': helpers.trimTag(['<br>', '<br />'], aux[1])
                        };
                    } else {
                        annotation = {
                            'before': helpers.trimTag(['<br>', '<br />'], annotation.before),
                            'after': helpers.trimTag(['<br>', '<br />'], annotation.after)
                        };
                    }
                } else {
                    annotation = helpers.trimTag(['<br>', '<br />'], annotation);
                }
            }

            return annotation;
        }
    });
});
