"use strict";

var express = require("express");

var router = express.Router();

var passport = require("passport");

var User = require("../models/user");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

; // ================================================

router.get("/", function (req, res) {
  res.render("campground/landing");
}); //===========//
// AUTH ROUTE
//===========//
//show registration form

router.get("/register", function (req, res) {
  res.render("register");
}); //handle sign up logic

router.post("/register", function (req, res) {
  var newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      // console.log(err);
      // req.flash("error",err.message);
      return res.render("register", {
        "error": err.message
      });
    }

    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
}); //show login form

router.get("/login", function (req, res) {
  res.render("login");
}); //login ROUTE

router.post("/login", passport.authenticate("local", {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), function (req, res) {// res.send("login successful");
}); // logout

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "logged out successfully");
  res.redirect("/campgrounds");
});
module.exports = router;