//==================
//COMMENT ROUTE
//==================
var express = require("express");
const campground = require("../models/campground");
var router = express.Router({mergeParams: true});
var CampGround = require("../models/campground");

var Comment = require("../models/comment");
var middleware = require("../middleware");
//middleware

//middleware

//COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
    //find campground by id    
    CampGround.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log("err");
        }
        else {
            res.render("comment/new", { campground: campground });
        }
    })

})//COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    CampGround.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log("Err");
                }
                else {
                    //and username and id to coment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment");
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
});
//edit
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    CampGround.findById(req.params.id, function(err, found){
        if(err||!found){
            req.flash("error","Campground not found");
           return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, comment) {

            if (err || !comment) {
                req.flash("error", "Comment not found")
                res.redirect("back");
            }
            else {
                res.render("comment/edit", { campground_id: req.params.id, comment: comment });
            }
        });
    });
    
   
});
//Update comments
router.put("/:comment_id",middleware.checkCommentOwnership,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
});
//Destroy Route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("/campgrounds/" + req.params.id);
       }
       else{
           req.flash("success","Comment Deleted");
           res.redirect("/campgrounds/"+req.params.id);
       }
   })
// res.send("DELETE");
});
module.exports = router;
