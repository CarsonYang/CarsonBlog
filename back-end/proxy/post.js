var postModel = require('../models/post').PostModel;
var redisClient = require('../utility/redisClient');
var tool = require('../utility/tool');

/**
 * Query
 * @param params
 * @returns {{}}
 */
function getPostsQuery(params) {
    var query = {};
    query.IsActive = true;
    query.IsDraft = false;
    if (params.cateId) {
        query.CategoryId = params.cateId;
    }
    if (params.keyword) {
        switch (params.filterType) {
            case '1':
                query.Title = {"$regex": params.keyword, "$options": "gi"};
                break;
            case '2':
                query.Labels = {"$regex": params.keyword, "$options": "gi"};
                break;
            case '3':
                query.CreateTime = {"$regex": params.keyword, "$options": "gi"};
                break;
            default:
                query.$or = [{
                    "Title": {
                        "$regex": params.keyword,
                        "$options": "gi"
                    }
                }, {
                    'Labels': {
                        "$regex": params.keyword,
                        "$options": "gi"
                    }
                }, {
                    'Summary': {
                        "$regex": params.keyword,
                        "$options": "gi"
                    }
                }, {
                    'Content': {
                        "$regex": params.keyword,
                        "$options": "gi"
                    }
                }];
        }
    }
    return query;
}

/**
 * Get the Articles of First Page
 * @param params
 * @param callback
 */
exports.getPosts = function (params, callback) {
    var cache_key = tool.generateKey('posts', params);
    redisClient.getItem(cache_key, function (err, posts) {
        if (err) {
            return callback(err);
        }
        if (posts) {
            return callback(null, posts);
        }
        var page = parseInt(params.pageIndex) || 1;
        var size = parseInt(params.pageSize) || 10;
        page = page > 0 ? page : 1;
        var options = {};
        options.skip = (page - 1) * size;
        options.limit = size;
        options.sort = params.sortBy === 'title' ? 'Title -CreateTime' : '-CreateTime';
        var query = getPostsQuery(params);
        postModel.find(query, {}, options, function (err, posts) {
            if (err) {
                return callback(err);
            }
            if (posts) {
                redisClient.setItem(cache_key, posts, redisClient.defaultExpired, function (err) {
                    if (err) {
                        return callback(err);
                    }
                })
            }
            return callback(null, posts);
        });
    });
};

/**
 * Get Page Count
 * @param params
 * @param callback
 */
exports.getPageCount = function (params, callback) {
    var cache_key = tool.generateKey('posts_count', params);
    redisClient.getItem(cache_key, function (err, pageCount) {
        if (err) {
            return callback(err);
        }
        if (pageCount) {
            return callback(null, pageCount);
        }
        var query = getPostsQuery(params);
        postModel.count(query, function (err, count) {
            if (err) {
                return callback(err);
            }
            var pageCount = count % params.pageSize === 0 ? parseInt(count / params.pageSize) : parseInt(count / params.pageSize) + 1;
            redisClient.setItem(cache_key, pageCount, redisClient.defaultExpired, function (err) {
                if (err) {
                    return callback(err);
                }
            });
            return callback(null, pageCount);
        });
    });
};

/**
 * Get Alias
 * @param alias
 * @param callback
 */
exports.getPostByAlias = function (alias, callback) {
    var cache_key = 'article_' + alias;
    postModel.update({"Alias": alias}, {"$inc": {"ViewCount": 1}}).exec();
    redisClient.getItem(cache_key, function (err, article) {
        if (err) {
            return callback(err);
        }
        if (article) {
            return callback(null, article);
        }
        postModel.findOne({"Alias": alias}, function (err, article) {
            if (err) {
                return callback(err);
            }
            if (article) {
                redisClient.setItem(cache_key, article, redisClient.defaultExpired, function (err) {
                    if (err) {
                        return callback(err);
                    }
                });
            }
            return callback(null, article);
        })
    });
};

/**
 * Query Articles
 * @param params
 * @returns {{}}
 */
function getArticlesQuery(params) {
    var query = {};
    if (params.cateId) {
        query.CategoryId = params.cateId;
    }
    if (params.uniqueId) {
        query._id = params.uniqueId;
    }
    if (params.title) {
        query.Title = {"$regex": params.title, "$options": "gi"};
    }
    if (params.searchText) {
        query.$or = [{
            "Alias": {
                "$regex": params.searchText,
                "$options": "gi"
            }
        }, {
            "Title": {
                "$regex": params.searchText,
                "$options": "gi"
            }
        }, {
            "Summary": {
                "$regex": params.searchText,
                "$options": "gi"
            }
        }, {
            "Content": {
                "$regex": params.searchText,
                "$options": "gi"
            }
        }, {
            "Labels": {
                "$regex": params.searchText,
                "$options": "gi"
            }
        }, {
            "Url": {
                "$regex": params.searchText,
                "$options": "gi"
            }
        }]
    }
    return query;
}

/**
 * Get Articles
 * @param param
 * @param callback
 */
exports.getArticles = function (params, callback) {
    var page = parseInt(params.pageIndex) || 1;
    var size = parseInt(params.pageSize) || 10;
    page = page > 0 ? page : 1;
    var options = {};
    options.skip = (page - 1) * size;
    options.limit = size;
    switch (params.sortName) {
        case 'ModifyTime':
            options.sort = params.sortOrder === 'desc' ? '-ModifyTime -CreateTime' : 'ModifyTime CreateTime';
            break;
        case 'ViewCount':
            options.sort = params.sortOrder === 'desc' ? '-ViewCount -CreateTime' : 'ViewCount CreateTime';
            break;
        default:
            options.sort = params.sortOrder === 'desc' ? '-CreateTime' : 'CreateTime';
            break;
    }
    var query = getArticlesQuery(params);
    postModel.find(query, {}, options, function (err, posts) {
        if (err) {
            return callback(err);
        }
        return callback(null, posts);
    });
};

/**
 * Get Articles Cout
 * @param params
 * @param callback
 */
exports.getArticlesCount = function (params, callback) {
    var query = getArticlesQuery(params);
    postModel.count(query, function (err, count) {
        if (err) {
            return callback(err);
        }
        return callback(null, count);
    });
};