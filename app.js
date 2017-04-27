var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
var PhotoModel = require("./models/photoModel");
var Comment    = require("./models/comment");
var seedDB	   = require("./seeds");
var passport   = require("passport");
var LocalStrategy = require("passport-local");
var flash = require('connect-flash');
var User = require("./models/user");

mongoose.connect("mongodb://localhost/photostudio");
app.use(express.static(__dirname + "/styles"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
seedDB();

//Passport configuration
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

// PhotoModel.create({
// 		name:"cat",
// 		src:"http://www.zivalice.si/wp-content/uploads/2016/01/sibirska-ma%C4%8Dka.png"
// },function(err,photo){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("New photo added");
// 		console.log(photo);
// 	}
// });





app.get("/",function(req,res){
	res.render("landing");
});



app.post("/photos",function(req,res){
	var name = req.body.name;
	var src = req.body.src;
	var des = req.body.des;
	var newPhoto = {name:name,src:src,des:des};
	PhotoModel.create(newPhoto,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/photos");
		}
	})
});

app.get("/upload",function(req,res){
	res.render("photos/upload");
});

app.get("/photos",function(req,res){
	PhotoModel.find({},function(err,photoCollection){
		if(err){
			console.log(err);
		}else{
			res.render("photos/photopage",{photos:photoCollection});
		}
	})
});
app.get("/photos/:id",function(req,res){
	PhotoModel.findById(req.params.id).populate("comments").exec(function(err,foundPhoto){
		if(err){
			console.log(err);
		}else{
			res.render("photos/show",{photo:foundPhoto});

		}
	});

})

// comment routes

app.get("/photos/:id/comments/new",isLoggedIn,function(req,res){
	PhotoModel.findById(req.params.id,function(err,photo){
		if(err){
			console.log(err);
		}else{
			res.render("comments/newcomment",{photo:photo});
		}
	})
});

app.post("/photos/:id/comments",isLoggedIn,function(req,res){
	PhotoModel.findById(req.params.id,function(err, photo){
		if(err){
			console.log(err);
		}else{
			Comment.create(req.body.comment,function(err, comment){
				if(err){
					console.log(err);
				}else{
					photo.comments.push(comment);
					photo.save();
					res.redirect("/photos/"+photo.id);
				}
			})
		}
	});
});

//
app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/photos");
		})
	})
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",
	{
		successRedirect:"/photos",
		failureRedirect:"/login",
		failureFlash: 'Invalid username or password.'
	}),function(req,res){
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/photos");
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen("3000",function(){
	console.log("Server started!");
});