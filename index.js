// ECHO is on.
var express = require("express");
var app = express();
var mongoose = require("mongoose");
console.log(process.env.DATABASEURL);
//local host
mongoose.connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
//=================================
//online host

// mongoose.connect('mongodb+srv://amansethi:amansethi123@cluster0.26lyh.mongodb.net/Yelp_camp_v11', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('connected to db');
// }).catch(err => {
//     console.log('error:', err.message);
// })
//===========================================
mongoose.set('useFindAndModify', false);
var bodyParser = require("body-parser");
var flash = require("connect-flash");
app.use(flash());
app.set("view engine","ejs");

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:true}));
var CampGround = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/user");
const { session } = require("passport");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/auth");
var methodOverride = require("method-override");

//seed the database
// seedDB();

app.use(require("express-session")({
       secret:"za warudo",
       resave: false,
       saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
app.use(methodOverride("_method"));

//===========================

//PASSPORT CONFIGURATION
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//===============================
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});