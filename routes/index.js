var express = require("express"),
    passport = require("passport"),
    users = require("../models/user"),
    router = express.Router(),
    middleware = require("../middleware");

router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/register", function (req, res) {
    res.render("register", { page: 'register' });
});

router.post("/register", function (req, res) {
    var user = { username: req.body.username };
    if(req.body.adminCode === "secret123"){
        user.isAdmin = true;
    }
    var newUser = new users(user);
    users.register(newUser, req.body.password, function (err, user) {
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
            res.redirect("/campgrounds");
        });
    });

});

router.get("/login", function (req, res) {
    res.render("login", { page: 'login' });
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