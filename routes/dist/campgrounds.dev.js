"use strict";

//INDEX - Show all campgrounds
var express = require("express");

var campground = require("../models/campground");

var router = express.Router();

var CampGround = require("../models/campground");

var middleware = require("../middleware"); //==============


router.get("/", function (req, res) {
  //Get all campgrounds from DB
  // console.log(req.user);
  CampGround.find({}, function (err, allcampgrounds) {
    if (err) {
      console.log("err");
    } else {
      res.render("campground/campgrounds", {
        campgrounds: allcampgrounds,
        currentUser: req.user
      });
    }
  });
}); //CREATE - add new campground to DB

router.post("/", middleware.isLoggedIn, function (req, res) {
  // console.log(req.body.name);
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author
  };
  CampGround.create(newCampground, function (err, newlycreated) {
    if (err) {
      console.log("err");
    } else {
      // console.log(newlycreated);
      res.redirect("/campgrounds");
    }
  });
}); //NEW - show form to create new campgrounds

router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campground/new");
}); // SHOW MORE DETAILS

router.get("/:id", function (req, res) {
  //find the campground with the given id
  //show more info
  CampGround.findById(req.params.id).populate("comments").exec(function (err, found) {
    if (err || !found) {
      req.flash("error", "Campground not found"); //console.log("err");

      res.redirect("back");
    } else {
      res.render("campground/show", {
        campgroundid: found
      });
    }
  });
}); //EDIT CAMPGROUND

router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
  // is user logged ?
  CampGround.findById(req.params.id, function (err, foundCampground) {
    res.render("campground/edit", {
      campground: foundCampground
    });
  }); //otherwise redirect
  //if not redirect
}); //UPDATE CAMPGROUND

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  //find and update the correct campground!
  CampGround.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
}); // DESTROY CAMPGROUND

router["delete"]("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  CampGround.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/camgrounds");
    }
  });
  req.flash("success", "Campground Removed");
  res.redirect("/campgrounds");
});
module.exports = router;