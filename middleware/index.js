//All Middware Go here
const campgrounds = require("../models/campground"),
    comments = require("../models/comment");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        comments.find(req.params.commentId, function (comment) {
            if (comment.author.id.equals(req.user._id)) {
                return next();
            }
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        campgrounds.find(req.params.id, function (campground) {
            if (campground.creator.id.equals(req.user._id)) {
                return next();
            }
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

module.exports = {
    checkCampgroundOwnership: checkCampgroundOwnership,
    checkCommentOwnership: checkCommentOwnership,
    isLoggedIn: isLoggedIn
};