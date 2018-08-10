var mongoose = require("mongoose");
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, { useNewUrlParser: true });


//SCHEMA SETUP
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    created: { type: Date, default: Date.now() }
});

var Comment = mongoose.model("Comment", commentSchema);

function createComment(commentObj, callback) {
    Comment.create(commentObj, function (err, comment) {
        if (err) {
            return console.error(err);
        }
        console.log("comment added to db...");
        if (callback) {
            callback(comment);
        }
    });
}

function findAllComments(callback) {
    Comment.find({}, function (err, comments) {
        if (err) {
            return console.error(err);
        }
        if (callback) {
            callback(comments);
        }
    });
}

function findComment(id, callback) {
    Comment.findById(id, function (err, comment) {
        if (err) {
            return console.error(err);
        }
        if (callback) {
            callback(comment);
        }
    });
}

function findAndUpdate(id, updateObj, callback) {
    Comment.findByIdAndUpdate(id, updateObj, function (err, comment) {
        if (err) {
            return console.error(err);
        }
        if (callback) {
            callback(comment);
        }
    });
}

function removeAll(callback) {
    Comment.remove({}, function (err) {
        if (err) {
            return console.error(err);
        }
        if (callback) {
            callback();
        }
        else {
            console.log("All comments were removed...");
        }
    });
}

function remove(id, callback) {
    Comment.findByIdAndRemove(id, function (err, res) {
        if (err) {
            return console.error(err);
        }
        if (callback) {
            callback(res);
        }
    });
}

module.exports = {
    create: createComment,
    findAll: findAllComments,
    find: findComment,
    findAndUpdate: findAndUpdate,
    removeAll: removeAll,
    removeComment: remove
};