var express = require("express");
var router = express.Router({mergeParams:true});
var PhotoModel = require("../models/photoModel");
var Comment = require("../models/comment")

router.get("/new",isLoggedIn,function(req,res){
	PhotoModel.findById(req.params.id,function(err,photo){
		if(err){
			console.log(err);
		}else{
			res.render("comments/newcomment",{photo:photo});
		}
	})
});

router.post("/",isLoggedIn,function(req,res){
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

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router;