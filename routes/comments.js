var express = require("express"),
    campgrounds = require("../models/campground"),
    comments = require("../models/comment"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function (req, res) {
    campgrounds.find(req.params.id, (campground) => {
        res.render("comments/new", { campground: campground });
    });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    campgrounds.find(req.params.id, (campground) => {
        var commentObj = {
            text: req.body.comment.text,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        };
        comments.create(commentObj, (comment) => {
            campground.comments.push(comment);
            campground.save();
            req.flash("success", "Successfully added a new comment");
            res.redirect(`/campgrounds/${campground._id}`);
        });
    });
});

router.get("/:commentId/edit", middleware.checkCommentOwnership, function (req, res) {
    comments.find(req.params.commentId, function (comment) {
        res.render("comments/edit", { comment: comment, campground_id: req.params.id });
    });
});

router.put("/:commentId", middleware.checkCommentOwnership, function (req, res) {
    comments.findAndUpdate(req.params.commentId, { $set: req.body.comment }, function (comment) {
        res.redirect("/campgrounds/" + req.params.id);
    });
});

router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res){
    comments.removeComment(req.params.commentId, function(deleted){
        req.flash("success", "Comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
    });
});



module.exports = router;