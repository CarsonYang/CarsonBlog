var dbPath = require('../config').DbPath;
// var dbPath =  process.env.MONGOLAB_URI;
var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
// use custom mongodb url or localhost
mongoose.connect(dbPath || "mongodb://localhost/blogrift");
var db = mongoose.connection;
db.on('error', function (err) {
    console.error(err);
    process.exit(1);
});
exports.mongoose = mongoose;

//Schema
var base = new mongoose.Schema({
    _id: {type: String, unique: true},
    CreateTime: {type: Date},
    ModifyTime: {type: Date}
});
exports.base = base;
