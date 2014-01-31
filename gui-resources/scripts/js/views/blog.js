'use strict';
define(['backbone', 'text!templates/blog.tmpl', 'dust'], function(Backbone, BlogTmpl, dust) {
    return Backbone.View.extend({
        initialize: function() {
            dust.loadSource(dust.compile(BlogTmpl, 'blog'));
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'sync', this.render);
            return this.listenTo(this.collection, 'change', this.render);
        },
        render: function() {
            var context, self;
            self = this;
            context = {
                'notice': 'This was rendered from the frontend',
                'length': this.collection.length,
                'posts': this.collection.toJSON(),
                'post': function(chunk, context, bodies) {
                    return chunk.map(function(chunk) {
                        return chunk.render(bodies.block, context).end();
                    });
                }
            };
            return dust.render('blog', context, function(err, out) {
                return self.$el.html(out);
            });
        }
    });
});