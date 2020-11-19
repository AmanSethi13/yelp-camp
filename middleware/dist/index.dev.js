"use strict";

var CampGround = require("../models/campground");

var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    CampGround.findById(req.params.id, function (err, foundCampground) {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
        // is user the author of the campground?   
        //console.log(foundCampground.author.id);    //mongoose object
        //console.log(req.user._id);               //string
        if (foundCampground.author.id.equals(req.user._id)) {
          //
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err || !foundComment) {
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        // is user the author of the comment?   
        //  console.log(foundComment.author.id);    //mongoose object
        // console.log(req.user._id);               //string
        if (foundComment.author.id.equals(req.user._id)) {
          //
          next();
        } else {
          req.flash("error", "You don't have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash("error", "You need to be logged in first");
  res.redirect("/login");
};

module.exports = middlewareObj;