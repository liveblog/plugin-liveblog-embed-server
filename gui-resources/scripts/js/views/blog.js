'use strict';
define(['backbone', 'dust', 'text!themes/base/blog.tmpl', 'dust'], function(Backbone, dust, blogTmpl) {
    return Backbone.View.extend({
        initialize: function() {
            dust.loadSource(dust.compile(blogTmpl, 'blog'));
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'sync', this.render);
            this.listenTo(this.collection, 'change', this.render);
        },
        render: function() {
            var self = this;
            var ctx = {
                'notice': 'This was rendered from the frontend',
                'length': this.collection.length,
                'posts': this.collection.toJSON(),
                'post': function(chunk, context, bodies) {
                    return chunk.map(function(chunk) {
                        chunk.render(bodies.block, context).end();
                    });
                }
            };
            dust.render('blog', ctx, function(err, out) {
                self.$el.html(out);
            });
        }
    });
});
