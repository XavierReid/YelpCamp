var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    creator: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
var Campground = mongoose.model("Campground", campgroundSchema);

function createCampground(campgroundObj, callback) {
    Campground.create(campgroundObj, function (err, campground) {
        if (err) {
            return console.error(err);
        }
        console.log("New campground added to db...");
        if (callback) {
            callback(campground);
        }
    });
}

function findAllCampgrounds(callback) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            return console.err(err);
        }
        if (callback) {
            callback(campgrounds);
        }
    });
}

// function findCampground(id, callback) {
//     Campground.findById(id, function (err, campground) {
//         if (err) {
//             return console.err(err);
//         }
//         if (callback) {
//             callback(campground);
//         }
//     });
// }

function findCampgroundWithComments(id, callback){
    Campground.findById(id).populate("comments").exec(function(err, campground){
        if(err){
            return console.error(err);
        }
        if(callback){
            callback(campground);
        }
    });
}

function removeAll(callback) {
    Campground.remove({}, function (err) {
        if (err) {
            return console.err(err);
        }
        if (callback) {
            callback();
        }
        else {
            console.log("All campgrounds were removed...");
        }
    });
}

function remove(id, callback){
    Campground.findByIdAndRemove(id, function(err, res){
        if(err){
            return console.error(err);
        }console.log(res);
        if(callback){
            callback(res);
        }
    });
}

function findAndUpdate(id, updateObj, callback){
    Campground.findByIdAndUpdate(id, updateObj, function(err, updatedCampground){
        if(err){
            return console.error(err);
        }
        if(callback){
            callback(updatedCampground);
        }
    });
}

module.exports = {
    create: createCampground,
    find: findCampgroundWithComments,
    findAll: findAllCampgrounds,
    removeAll: removeAll,
    removeById: remove,
    findAndUpdate: findAndUpdate
};