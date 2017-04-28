var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var PhotoModel = require("./models/photoModel");
var Comment    = require("./models/comment");
var seedDB	   = require("./seeds");
var passport   = require("passport");
var methodOverride = require("method-override");
var LocalStrategy = require("passport-local");
var flash = require('connect-flash');
var User = require("./models/user");

var commentRoutes    = require("./routes/comments"),
    photoRoutes = require("./routes/photos"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/photostudio");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
seedDB();

app.use(require("express-session")({
	secret:"Secret session",
	resave: false,
	saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});
app.use(indexRoutes);
app.use("/photos",photoRoutes);
app.use("/photos/:id/comments",commentRoutes);

app.listen("3000",function(){
	console.log("Server started!");
});