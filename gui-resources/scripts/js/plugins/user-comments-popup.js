'use strict';
define([
    'underscore',
    'backbone-custom',
    'views/base-view',
    'lib/helpers/display-toggle',
    'models/comment'
], function(_, Backbone, BaseView, displayToggle, Comment) {

    return BaseView.extend({

        messageDisplayTime: 5000,
        initialize: function() {
            this.clientEvents({
                'click [data-gimme="blog.comment"]': 'togglePopup',
                'click #comment-message-btn': 'showAfterMessage',
                'click .button.cancel': 'togglePopup',
                'click .button.send': 'send'
            });
            this.popup = this.$('[data-gimme="blog.comment-box-holder"]');
            displayToggle(this.popup, false);
            this.popup_message = this.$('[data-gimme="blog.comment-box-message"]');
            displayToggle(this.popup_message, false);

            this.username = this.$('[data-gimme="blog.comment-nickname"]');
            this.text = this.$('[data-gimme="blog.comment-text"]');
            this.resetInput();
            this.backdropel = this.$('[data-gimme="blog.comment-backdrop"]');
            this.backdropel.data('show-status', 0);
            this.lbpostlist = this.backdropel.parent();
        },
        togglePopup: function(e) {
            var view = this,
                showStatus = view.backdropel.data('show-status');
            e.preventDefault();
            switch (showStatus) {
                case 0:
                    displayToggle(view.popup, true);
                    view.backdropel.data('show-status', 1);
                    displayToggle(view.backdropel, true);
                    view.lbpostlist.addClass('comment-active');
                    view.blogview.stopPoller();
                    break;
                case 1:
                    view.backdropel.data('show-status', 0).hide();
                    displayToggle(view.popup_message, false);
                    view.resetInput();
                    view.lbpostlist.removeClass('comment-active');
                    displayToggle(view.popup, false);
                    view.blogview.starPoller();
                    break;
                case 2:
                    displayToggle(view.popup_message, false);
                    view.resetInput();
                    view.lbpostlist.removeClass('comment-active');
                    displayToggle(view.popup, false);
                    view.blogview.starPoller();
                    break;
            }
        },
        send: function(e) {
            e.preventDefault();
            var self = this;
            console.log('model urlRoot is ', this.model.get('CommentPost').href);
            if (this.isValid()) {
                var comment = new Comment();
                var attrs = {
                    UserName: this.username.val(),
                    CommentText: this.text.val()
                };
                console.log('is new ', comment.isNew());
                comment.setUrlRoot(this.model.get('CommentPost').href);
                comment.save(attrs, {
                    success: function() {
                        console.log('save success');
                        self.showAfterMessage(e);
                        self.resetInput();
                    },
                    error: function() {
                        console.log('save error');
                        self.showAfterMessage(e);
                        self.resetInput();
                    },
                    crossDomain: true,
                    type: 'post'
                });
            }
        },
        resetInput: function() {
            this.username.val('');
            this.text.val('');
            displayToggle(this.$('.error'), false);
        },
        showAfterMessage: function(e) {
            var view = this;
            view.backdropel.data('show-status', 2);
            displayToggle(view.backdropel, true);
            displayToggle(view.popup);
            view.backdropel.data('show-status', 1);
            displayToggle(this.popup_message, true);
            setTimeout(function() {
                displayToggle(view.popup_message, false);
                view.backdropel.data('show-status', 0);
                displayToggle(view.backdropel, false);
            }, view.messageDisplayTime);
        },
        isValid: function() {
            if (!this.username.val()) {
                displayToggle(this.username.next('.error'), true);
            } else {
                displayToggle(this.username.next('.error'), false);
            }

            if (!this.text.val()) {
                displayToggle(this.text.next('.error'), true);
            } else {
                displayToggle(this.text.next('.error'), false);
            }
            return this.$('.error:visible').length === 0;
        }
    });
});
