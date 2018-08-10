var express = require("express"),
    campgrounds = require("../models/campground"),
    comments = require("../models/comment"),
    router = express.Router(),
    middleware = require("../middleware");

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
        var campgroundObj = req.body.campground;
        campgroundObj.creator = creator;
    campgrounds.create(campgroundObj, function (campground) {
        res.redirect("/campgrounds", {page: 'campgrounds'});
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
    campgrounds.findAndUpdate(req.params.id, { $set: req.body.campground }, function (updateCampground) {
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    campgrounds.removeById(req.params.id, function (deleted) {
        deleted.comments.forEach(comment => {
            console.log(comment);
            comments.removeComment(comment, function(deletedComment){
            });
        });
        res.redirect("/campgrounds");
    });
});

module.exports = router;