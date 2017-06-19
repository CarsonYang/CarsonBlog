var express = require('express');
var router = express.Router();
var log4js = require('log4js');

var async = require('async');
var user = require('../proxy/user');

log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: '/home/logs/logtest.log', category: 'login' }
    ]
});

var logger = log4js.getLogger('about_new');


var tool = require('../utility/tool');
var path = require('path');

router.get('/about_new', function (req, res, next) {
    async.parallel([
        function (cb) {
            tool.getConfig(path.join(__dirname, '../config/about_new.json'), function (err, about) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, about);
                }
            });
        }
    ], function (err, results) {
        var about;
        if (err) {
            next(err);
        } else {
            about = results[0];
            res.json(about);
        }
    });
});

module.exports = router;
