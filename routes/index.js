var express = require("express"),
    passport = require("passport"),
    users = require("../models/user"),
    router = express.Router(),
    middleware = require("../middleware");

router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    var newUser = new users({ username: req.body.username });
    users.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });

});

router.get("/login", function (req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) {
    });

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("back");
});

module.exports = router;