var express = require("express"),
    campgrounds = require("../models/campground"),
    comments = require("../models/comment"),
    router = express.Router(),
    middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

router.get("/", function (req, res) {
    campgrounds.findAll(function (campgrounds) {
        res.render("campgrounds/index", { campgrounds: campgrounds });
    });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    var creator = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.campground.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var campgroundObj = req.body.campground;
        campgroundObj.creator = creator;
        campgroundObj.location = location;
        campgroundObj.lat = lat;
        campgroundObj.long = lng;
        campgrounds.create(campgroundObj, function (campground) {
            res.redirect("/campgrounds", { page: 'campgrounds' });
        });
    });
});

router.get("/:id", function (req, res) {
    var id = req.params.id;
    campgrounds.find(id, function (campground) {
        res.render("campgrounds/show", { campground: campground });
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    campgrounds.find(req.params.id, function (campground) {
        res.render("campgrounds/edit", { campground: campground });

    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
    });
    campgrounds.findAndUpdate(req.params.id, { $set: req.body.campground }, function (updateCampground) {
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    campgrounds.removeById(req.params.id, function (deleted) {
        deleted.comments.forEach(comment => {
            console.log(comment);
            comments.removeComment(comment, function (deletedComment) {
            });
        });
        res.redirect("/campgrounds");
    });
});

module.exports = router;