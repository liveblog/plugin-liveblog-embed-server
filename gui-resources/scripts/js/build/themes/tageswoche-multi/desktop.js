liveblog.define("plugins",{}),liveblog.define("plugins/pagination",["plugins","lib/utils"],function(t,e){return t.pagination=function(){e.dispatcher.once("initialize.posts-view",function(t){t.collection.clearPaginationParams(),liveblog.limit&&(t.collection.syncParams.pagination.limit=parseInt(liveblog.limit,10)),t.flags.loadingNextPage=!1,t.updateNextPageOffset=function(){this.collection.syncParams.pagination.offset=this.collection.length},t.topPage=function(){return delete this.collection.syncParams.pagination["order.end"],this.collection.syncParams.pagination.offset=0,this.collection.fetchPage({reset:!0})},t.nextPage=function(){if(!this.flags.loadingNextPage&&this.hasNextPage()){e.dispatcher.trigger("loading.posts-view",this),this.flags.loadingNextPage=!0,this.updateNextPageOffset();var t=this;return this.collection.fetchPage().done(function(){t.flags.loadingNextPage=!1,e.dispatcher.trigger("loaded.posts-view",t)})}},t.hasNextPage=function(){return this.collection.length<this.collection.filterProps.total},t.hasTopPage=function(){return this.flags.hasTopPage?!0:!1}})},t.pagination}),liveblog.define("lib/helpers/twitter",[],function(){var t={link:{anchor:function(t){return t.replace(/[äéöüßÄÖÜA-Za-z]+:\/\/[äéöüßÄÖÜA-Za-z0-9-_]+\.[äéöüßÄÖÜA-Za-z0-9-_:%&\?\/.=]+/g,function(t){return t=t.link(t),t=t.replace('href="','target="_blanka" href="')})},user:function(t){return t.replace(/[@]+[äéöüßÄÖÜA-Za-z0-9-_]+/g,function(t){var e=t.replace("@","");return t=t.link("http://twitter.com/"+e),t=t.replace('href="','target="_blankb" onclick="loadProfile(\''+e+'\');return(false);"  href="')})},tag:function(t){return t.replace(/[#]+[äéöüßÄÖÜA-Za-z0-9-_]+/g,function(t){var e=t.replace("#","%23");return t=t.link("http://twitter.com/search?q="+e),t=t.replace('href="','target="_blank" href="')})},all:function(t){return t=this.anchor(t),t=this.user(t),t=this.tag(t)}}};return t}),liveblog.define("tmpl!themeBase/plugins/after-button-pagination",["dust"],function(t){return function(){function e(t,e){return e=e.shiftBlocks(u),t.partial(n,e,null)}function n(t,e){return e=e.shiftBlocks(u),t.reference(e.get(["baseItem"],!1),e,"h")}function i(t,e){return e=e.shiftBlocks(u),t.write("load-next")}function o(t,e){return e=e.shiftBlocks(u),t.block(e.getBlock("loadNext"),e,{block:r},null).block(e.getBlock("loadingNext"),e,{block:l},null)}function r(t,e){return e=e.shiftBlocks(u),t}function l(t,e){return e=e.shiftBlocks(u),t}function s(t,e){return e=e.shiftBlocks(u),t.write('<a class="load-more">').helper("i18n",e,{},{msgid:"Load more posts ..."}).write("</a>")}function a(t,e){return e=e.shiftBlocks(u),t.write('<span class="loading-image"></span>')}function c(t,e){return e=e.shiftBlocks(u),t.write('data-gimme="posts.nextPage"')}t.register("themeBase/plugins/after-button-pagination",e);var u={itemClass:i,main:o,loadNext:s,loadingNext:a,additionalAttributes:c};return e}(),{render:function(e,n){return t.render("themeBase/plugins/after-button-pagination",e,n)}}}),liveblog.define("tmpl!themeBase/plugins/before-button-pagination",["dust"],function(t){return function(){function e(t,e){return e=e.shiftBlocks(u),t.partial(n,e,null)}function n(t,e){return e=e.shiftBlocks(u),t.reference(e.get(["baseItem"],!1),e,"h")}function i(t,e){return e=e.shiftBlocks(u),t.write("load-next")}function o(t,e){return e=e.shiftBlocks(u),t.block(e.getBlock("loadNext"),e,{block:r},null).block(e.getBlock("loadingNext"),e,{block:l},null)}function r(t,e){return e=e.shiftBlocks(u),t}function l(t,e){return e=e.shiftBlocks(u),t}function s(t,e){return e=e.shiftBlocks(u),t.write('<a class="load-more">Load top posts</a>')}function a(t,e){return e=e.shiftBlocks(u),t.write('<span class="loading-image"></span>')}function c(t,e){return e=e.shiftBlocks(u),t.write('data-gimme="posts.beforePage"')}t.register("themeBase/plugins/before-button-pagination",e);var u={itemClass:i,main:o,loadNext:s,loadingNext:a,additionalAttributes:c};return e}(),{render:function(e,n){return t.render("themeBase/plugins/before-button-pagination",e,n)}}}),liveblog.define("plugins/button-pagination",["backbone","plugins","plugins/pagination","dust","lib/utils","lib/helpers/display-toggle","tmpl!themeBase/item/base","tmpl!themeBase/plugins/after-button-pagination","tmpl!themeBase/plugins/before-button-pagination"],function(t,e,n,i,o,r){return delete e.pagination,e["button-pagination"]=function(e){n(e),o.dispatcher.on("initialize.blog-view",function(t){t.clientEvents({'click [data-gimme="posts.to-top"]':"toTop"}),t.toTop=function(){var t=this,e=t.el.offset();window.scrollTo(e.left,e.top)}}),o.dispatcher.once("add-all.posts-view",function(e){var n={};n.baseItem=i.themed("themeBase/item/base"),0===e.$('[data-gimme="posts.beforePage"]').length&&i.renderThemed("themeBase/plugins/before-button-pagination",n,function(n,i){var o=t.$(i);r(o,!1),e.$el.prepend(o)}),0===e.$('[data-gimme="posts.nextPage"]').length&&i.renderThemed("themeBase/plugins/after-button-pagination",n,function(n,i){var o=t.$(i);r(o,!1),e.$el.append(o)})}),o.dispatcher.once("add-all.posts-view",function(t){t.checkNextPage(),t.checkTopPage()}),o.dispatcher.once("initialize.posts-view",function(t){t.clientEvents({'click [data-gimme="posts.nextPage"]':"buttonNextPage",'click [data-gimme="posts.beforePage"]':"buttonTopPage"}),t.checkTopPage=function(){r(this.$('[data-gimme="posts.beforePage"]'),this.hasTopPage())},t.checkNextPage=function(){r(this.$('[data-gimme="posts.nextPage"]'),this.hasNextPage()),o.dispatcher.trigger("pagination-next-updated.posts-view",this)},t.buttonNextPage=function(){t.flags.buttonNextPage=!0;var e=t.$('[data-gimme="posts.nextPage"]');e.addClass("loading"),t.nextPage().done(function(){t.flags.buttonNextPage=!1,e.removeClass("loading"),t.checkNextPage()})},t.buttonTopPage=function(){var e=t.$('[data-gimme="posts.beforePage"]');e.addClass("loading"),t.flags.topPage=!1,t.topPage().done(function(){e.removeClass("loading"),r(e,!1),t.checkNextPage()})}})},e["button-pagination"]}),function(){var t=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1},e=[].slice;!function(t,e){return"function"==typeof liveblog.define&&liveblog.define.amd?liveblog.define("waypoints",["jquery"],function(n){return e(n,t)}):e(t.jQuery,t)}(this,function(n,i){var o,r,l,s,a,c,u,f,h,d,g,p,b,k,m,v;return o=n(i),f=t.call(i,"ontouchstart")>=0,s={horizontal:{},vertical:{}},a=1,u={},c="waypoints-context-id",g="resize.waypoints",p="scroll.waypoints",b=1,k="waypoints-waypoint-ids",m="waypoint",v="waypoints",r=function(){function t(t){var e=this;this.$element=t,this.element=t[0],this.didResize=!1,this.didScroll=!1,this.id="context"+a++,this.oldScroll={x:t.scrollLeft(),y:t.scrollTop()},this.waypoints={horizontal:{},vertical:{}},this.element[c]=this.id,u[this.id]=this,t.bind(p,function(){var t;return e.didScroll||f?void 0:(e.didScroll=!0,t=function(){return e.doScroll(),e.didScroll=!1},i.setTimeout(t,n[v].settings.scrollThrottle))}),t.bind(g,function(){var t;return e.didResize?void 0:(e.didResize=!0,t=function(){return n[v]("refresh"),e.didResize=!1},i.setTimeout(t,n[v].settings.resizeThrottle))})}return t.prototype.doScroll=function(){var t,e=this;return t={horizontal:{newScroll:this.$element.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.$element.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}},!f||t.vertical.oldScroll&&t.vertical.newScroll||n[v]("refresh"),n.each(t,function(t,i){var o,r,l;return l=[],r=i.newScroll>i.oldScroll,o=r?i.forward:i.backward,n.each(e.waypoints[t],function(t,e){var n,o;return i.oldScroll<(n=e.offset)&&n<=i.newScroll?l.push(e):i.newScroll<(o=e.offset)&&o<=i.oldScroll?l.push(e):void 0}),l.sort(function(t,e){return t.offset-e.offset}),r||l.reverse(),n.each(l,function(t,e){return e.options.continuous||t===l.length-1?e.trigger([o]):void 0})}),this.oldScroll={x:t.horizontal.newScroll,y:t.vertical.newScroll}},t.prototype.refresh=function(){var t,e,i,o=this;return i=n.isWindow(this.element),e=this.$element.offset(),this.doScroll(),t={horizontal:{contextOffset:i?0:e.left,contextScroll:i?0:this.oldScroll.x,contextDimension:this.$element.width(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:i?0:e.top,contextScroll:i?0:this.oldScroll.y,contextDimension:i?n[v]("viewportHeight"):this.$element.height(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}},n.each(t,function(t,e){return n.each(o.waypoints[t],function(t,i){var o,r,l,s,a;return o=i.options.offset,l=i.offset,r=n.isWindow(i.element)?0:i.$element.offset()[e.offsetProp],n.isFunction(o)?o=o.apply(i.element):"string"==typeof o&&(o=parseFloat(o),i.options.offset.indexOf("%")>-1&&(o=Math.ceil(e.contextDimension*o/100))),i.offset=r-e.contextOffset+e.contextScroll-o,i.options.onlyOnScroll&&null!=l||!i.enabled?void 0:null!==l&&l<(s=e.oldScroll)&&s<=i.offset?i.trigger([e.backward]):null!==l&&l>(a=e.oldScroll)&&a>=i.offset?i.trigger([e.forward]):null===l&&e.oldScroll>=i.offset?i.trigger([e.forward]):void 0})})},t.prototype.checkEmpty=function(){return n.isEmptyObject(this.waypoints.horizontal)&&n.isEmptyObject(this.waypoints.vertical)?(this.$element.unbind([g,p].join(" ")),delete u[this.id]):void 0},t}(),l=function(){function t(t,e,i){var o,r;i=n.extend({},n.fn[m].defaults,i),"bottom-in-view"===i.offset&&(i.offset=function(){var t;return t=n[v]("viewportHeight"),n.isWindow(e.element)||(t=e.$element.height()),t-n(this).outerHeight()}),this.$element=t,this.element=t[0],this.axis=i.horizontal?"horizontal":"vertical",this.callback=i.handler,this.context=e,this.enabled=i.enabled,this.id="waypoints"+b++,this.offset=null,this.options=i,e.waypoints[this.axis][this.id]=this,s[this.axis][this.id]=this,o=null!=(r=this.element[k])?r:[],o.push(this.id),this.element[k]=o}return t.prototype.trigger=function(t){return this.enabled?(null!=this.callback&&this.callback.apply(this.element,t),this.options.triggerOnce?this.destroy():void 0):void 0},t.prototype.disable=function(){return this.enabled=!1},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0},t.prototype.destroy=function(){return delete s[this.axis][this.id],delete this.context.waypoints[this.axis][this.id],this.context.checkEmpty()},t.getWaypointsByElement=function(t){var e,i;return(i=t[k])?(e=n.extend({},s.horizontal,s.vertical),n.map(i,function(t){return e[t]})):[]},t}(),d={init:function(t,e){var i;return null==e&&(e={}),null==(i=e.handler)&&(e.handler=t),this.each(function(){var t,i,o,s;return t=n(this),o=null!=(s=e.context)?s:n.fn[m].defaults.context,n.isWindow(o)||(o=t.closest(o)),o=n(o),i=u[o[0][c]],i||(i=new r(o)),new l(t,i,e)}),n[v]("refresh"),this},disable:function(){return d._invoke.call(this,"disable")},enable:function(){return d._invoke.call(this,"enable")},destroy:function(){return d._invoke.call(this,"destroy")},prev:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){return e>0?t.push(n[e-1]):void 0})},next:function(t,e){return d._traverse.call(this,t,e,function(t,e,n){return e<n.length-1?t.push(n[e+1]):void 0})},_traverse:function(t,e,o){var r,l;return null==t&&(t="vertical"),null==e&&(e=i),l=h.aggregate(e),r=[],this.each(function(){var e;return e=n.inArray(this,l[t]),o(r,e,l[t])}),this.pushStack(r)},_invoke:function(t){return this.each(function(){var e;return e=l.getWaypointsByElement(this),n.each(e,function(e,n){return n[t](),!0})}),this}},n.fn[m]=function(){var t,i;return i=arguments[0],t=2<=arguments.length?e.call(arguments,1):[],d[i]?d[i].apply(this,t):n.isFunction(i)?d.init.apply(this,arguments):n.isPlainObject(i)?d.init.apply(this,[null,i]):n.error(i?"The "+i+" method does not exist in jQuery Waypoints.":"jQuery Waypoints needs a callback function or handler option.")},n.fn[m].defaults={context:i,continuous:!0,enabled:!0,horizontal:!1,offset:0,triggerOnce:!1},h={refresh:function(){return n.each(u,function(t,e){return e.refresh()})},viewportHeight:function(){var t;return null!=(t=i.innerHeight)?t:o.height()},aggregate:function(t){var e,i,o;return e=s,t&&(e=null!=(o=u[n(t)[0][c]])?o.waypoints:void 0),e?(i={horizontal:[],vertical:[]},n.each(i,function(t,o){return n.each(e[t],function(t,e){return o.push(e)}),o.sort(function(t,e){return t.offset-e.offset}),i[t]=n.map(o,function(t){return t.element}),i[t]=n.unique(i[t])}),i):[]},above:function(t){return null==t&&(t=i),h._filter(t,"vertical",function(t,e){return e.offset<=t.oldScroll.y})},below:function(t){return null==t&&(t=i),h._filter(t,"vertical",function(t,e){return e.offset>t.oldScroll.y})},left:function(t){return null==t&&(t=i),h._filter(t,"horizontal",function(t,e){return e.offset<=t.oldScroll.x})},right:function(t){return null==t&&(t=i),h._filter(t,"horizontal",function(t,e){return e.offset>t.oldScroll.x})},enable:function(){return h._invoke("enable")},disable:function(){return h._invoke("disable")},destroy:function(){return h._invoke("destroy")},extendFn:function(t,e){return d[t]=e},_invoke:function(t){var e;return e=n.extend({},s.vertical,s.horizontal),n.each(e,function(e,n){return n[t](),!0})},_filter:function(t,e,i){var o,r;return(o=u[n(t)[0][c]])?(r=[],n.each(o.waypoints[e],function(t,e){return i(o,e)?r.push(e):void 0}),r.sort(function(t,e){return t.offset-e.offset}),n.map(r,function(t){return t.element})):[]}},n[v]=function(){var t,n;return n=arguments[0],t=2<=arguments.length?e.call(arguments,1):[],h[n]?h[n].apply(null,t):h.aggregate.call(null,n)},n[v].settings={resizeThrottle:100,scrollThrottle:30},o.load(function(){return n[v]("refresh")})})}.call(this),liveblog.require.config({paths:{twitterWidgets:"//platform.twitter.com/widgets"},shim:{twitterWidgets:{exports:"twttr"}}}),liveblog.define("plugins/twitter-widgets",["underscore","backbone","plugins","dust","lib/utils"],function(t,e,n,i,o){return n["twitter-widgets"]=function(){if(o.isClient){o.dispatcher.on("before-render.post-view",function(t){"themeBase/item/source/twitter"===t.itemName()&&(t.parentView()._twitterPosts||(t.parentView()._twitterPosts=[]),t.parentView()._twitterPosts.push(t))}),o.dispatcher.on("add-all.posts-view",function(t){e(t)});var e=function(e){e._twitterPosts&&liveblog.require(["twitterWidgets","waypoints"],function(n){n.ready(function(){t.each(e._twitterPosts,function(t){t.$el.waypoint(function(){var e=t.model.get("Meta").id_str;n.widgets.createTweet(e,t.$el.find(".post-content-full").get(0),function(){t.$el.find(".post-core-content").remove()},{cards:"all"})},{triggerOnce:!0,offset:"120%",context:e.el})}),e._twitterPosts=[]})},function(){})}}},n["twitter-widgets"]}),liveblog.define("lib/helpers/escape-RegExp",[],function(){var t=function(t){return t.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1")};return t}),liveblog.define("plugins/post-hash",["plugins","lib/utils","lib/helpers/escape-RegExp"],function(t,e,n){t["post-hash"]=function(){var t,i="liveblog.item.id",o=liveblog.hashmark?liveblog.hashmark:"?";t=e.isClient?window.location.href:liveblog.locationHref||"/",e.dispatcher.on("initialize.post-view",function(e){e.permalink=function(r){var l=r&&r.hashMark?r.hashMark:o,s=!1,a=i+"="+parseFloat(e.model.get("Order"));if(-1===t.indexOf(l))s=t+l+a;else if(-1!==t.indexOf(i+"=")){var c=new RegExp(n(i)+"=[^&#]*");s=t.replace(c,a)}else s=t+"&"+a;return s}}),e.dispatcher.on("initialize.posts-view",function(e){var n=t.indexOf(i+"=");-1!==n&&(e.collection.syncParams.pagination["order.end"]=parseFloat(t.substr(n+i.length+1)),e.flags.hasTopPage=!0,e.flags.autoRender=!1)})}}),liveblog.define("tmpl!theme/container",["dust"],function(t){return function(){function e(t,e){return e=e.shiftBlocks(g),t.partial("themeBase/container",e,null)}function n(t,e){return e=e.shiftBlocks(g),t}function i(t,e){return e=e.shiftBlocks(g),t.write('<div class="liveblog-content">').block(e.getBlock("content"),e,{block:o},null).write("</div>")}function o(t,e){return e=e.shiftBlocks(g),t.block(e.getBlock("contentTopContainer"),e,{block:r},null).block(e.getBlock("contentMiddleContainer"),e,{block:c},null).block(e.getBlock("contentBottomContainer"),e,{block:h},null)}function r(t,e){return e=e.shiftBlocks(g),t.write('<div class="liveblog-content-top">').block(e.getBlock("contentTop"),e,{block:l},null).write("</div>")}function l(t,e){return e=e.shiftBlocks(g),t.block(e.getBlock("status"),e,{block:s},null).block(e.getBlock("actionTotop"),e,{block:a},null)}function s(t,e){return e=e.shiftBlocks(g),t}function a(t,e){return e=e.shiftBlocks(g),t}function c(t,e){return e=e.shiftBlocks(g),t.write('<div class="liveblog-content-middle"> ').block(e.getBlock("contentMiddle"),e,{block:u},null).write("</div>")}function u(t,e){return e=e.shiftBlocks(g),t.block(e.getBlock("postsList"),e,{block:f},null)}function f(t,e){return e=e.shiftBlocks(g),t}function h(t,e){return e=e.shiftBlocks(g),t}function d(t,e){return e=e.shiftBlocks(g),t}t.register("theme/container",e);var g={headerContainer:n,contentContainer:i,footerContainer:d};return e}(),{render:function(e,n){return t.render("theme/container",e,n)}}}),liveblog.define("tmpl!theme/item/base",["dust"],function(t){return function(){function e(t,e){return e=e.shiftBlocks(g),t.partial("themeBase/item/base",e,null)}function n(t,e){return e=e.shiftBlocks(g),t}function i(t,e){return e=e.shiftBlocks(g),t.write('<div class="post-info">').block(e.getBlock("postDateContainer"),e,{block:o},null).block(e.getBlock("userNameContainer"),e,{block:r},null).block(e.getBlock("shareContainer"),e,{block:l},null).write("</div>").block(e.getBlock("commentBefore"),e,{block:s},null).block(e.getBlock("contentMainFull"),e,{block:a},null).block(e.getBlock("commentAfter"),e,{block:d},null)}function o(t,e){return e=e.shiftBlocks(g),t}function r(t,e){return e=e.shiftBlocks(g),t}function l(t,e){return e=e.shiftBlocks(g),t}function s(t,e){return e=e.shiftBlocks(g),t}function a(t,e){return e=e.shiftBlocks(g),t.write('<div class="post-content-full">').block(e.getBlock("contentFull"),e,{block:c},null).write("</div>")}function c(t,e){return e=e.shiftBlocks(g),t.block(e.getBlock("contentCoreContainer"),e,{block:u},null).block(e.getBlock("contentAttrContainer"),e,{block:h},null)}function u(t,e){return e=e.shiftBlocks(g),t.write('<div class="post-core-content">').block(e.getBlock("contentCore"),e,{block:f},null).write("</div>")}function f(t,e){return e=e.shiftBlocks(g),t}function h(t,e){return e=e.shiftBlocks(g),t}function d(t,e){return e=e.shiftBlocks(g),t}t.register("theme/item/base",e);var g={headerContainer:n,contentMainBody:i};return e}(),{render:function(e,n){return t.render("theme/item/base",e,n)}}}),liveblog.define("themeFile",["css!theme/liveblog","plugins/button-pagination","plugins/twitter-widgets","plugins/post-hash","tmpl!theme/container","tmpl!theme/item/base"],function(){return{plugins:["button-pagination","twitter-widgets","post-hash"]}});