var db = require('./db'),
    mongoose = db.mongoose,
    base = db.base;

var postSchema = base.extend({
    Title: {type: String},
    Alias: {type: String},
    Summary: {type: String},
    Source: {type: String},
    Content: {type: String},
    CategoryId: {type: String},
    Labels: {type: String},
    Url: {type: String},
    ViewCount: {type: Number},
    IsDraft: {type: Boolean},
    IsActive: {type: Boolean, default: true}
});

exports.PostModel = mongoose.model('post', postSchema, 'post');