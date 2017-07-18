/**
 * Created by NUC on 2017/6/24.
 */
/*global self, caches, fetch*/
(function (self, caches, fetch) {
    "use strict";

    var CACHE_VERSION = 1,
        CACHE_NAME = "CarsonBlog-" + CACHE_VERSION.toString();
    self.addEventListener("install", function (event) {
        event.waitUntil(caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll([
                    "javascripts/blog_index.js",
                    "javascripts/about_index.js",
                    "javascripts/gadget_global.js",
                    "javascripts/gadget_right.js",
                    "javascripts/gadget_top.js",
                    "javascripts/highlight.pack.js",
                    "javascripts/selectlist.js",
                    "images/background_1.jpg",
                    "images/pic1.jpg",
                    "images/sailing3.jpg",
                    "libs/bootstrap/dist/css/bootstrap.min.css",
                    "libs/bootstrap/dist/js/bootstrap.min.js",
                    "libs/font-awesome/css/font-awesome.min.css",
                    "libs/jQuery-cycleText/dist/js/jquery.cycleText.min.js",
                    "libs/jquery-qrcode/dist/jquery.qrcode.min.js",
                    "libs/jquery/dist/jquery.min.js",
                    "libs/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js",
                    "libs/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css",
                    "libs/malihu-custom-scrollbar-plugin/mCSB_buttons.png",
                    "libs/handlebars.js",
                    "libs/jio-latest.min.js",
                    "libs/renderjs.js",
                    "libs/rsvp.js",
                    "stylesheets/animate-custom.css",
                    "stylesheets/bootstrap-addon.css",
                    "stylesheets/home-loading.css",
                    "stylesheets/railscasts.css",
                    "stylesheets/selectlist.css",
                    "stylesheets/share.css",
                    "stylesheets/site.css",
                    "pages/shared/gadget_footer.html",
                    "pages/shared/gadget_right.html",
                    "pages/shared/gadget_top.html",
                    "pages/blog/index.html",
                    "pages/about/about.html"
                ]);
            })
            .then(function () {
                return self.skipWaiting();
            }));
    });

    self.addEventListener("fetch", function (event) {
        event.respondWith(caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            }));
    });

    self.addEventListener("activate", function (event) {
        event.waitUntil(caches.keys()
            .then(function (keys) {
                return Promise.all(keys
                    .filter(function (key) {
                        return key !== CACHE_NAME;
                    })
                    .map(function (key) {
                        return caches.delete(key);
                    }));
            })
            .then(function () {
                self.clients.claim();
            }));
    });

}(self, caches, fetch));