var redis = require('redis');
var config = require('../config');
// use custom redis url or localhost
var client = redis.createClient(config.RedisPort || 6379, config.RedisHost || 'localhost');
client.on('error', function (err) {
    console.error('Redis connect wrongly: ' + err);
    process.exit(1);
});

/**
 * Config Cache
 * @param key
 * @param value
 * @param expired
 * @param callback
 */
exports.setItem = function (key, value, expired, callback) {
    client.set(key, JSON.stringify(value), function (err) {
        if (err) {
            return callback(err);
        }
        if (expired) {
            client.expire(key, expired);
        }
        return callback(null);
    });
};

/**
 * Get Cache
 * @param key
 * @param callback
 */
exports.getItem = function (key, callback) {
    client.get(key, function (err, reply) {
        if (err) {
            return callback(err);
        }
        return callback(null, JSON.parse(reply));
    });
};

/**
 * Remove Cache
 * @param key
 * @param callback
 */
exports.removeItem = function (key, callback) {
    client.del(key, function (err) {
        if (err) {
            return callback(err);
        }
        return callback(null);
    });
};

/**
 * Get Cache Expired Time
 */
exports.defaultExpired = parseInt(require('../config/settings').CacheExpired);
