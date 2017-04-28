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
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					photo.comments.push(comment);
					photo.save();
					res.redirect("/photos/"+photo.id);
				}
			})
		}
	});
});

router.get("/:comment_id/edit",isCommentAuthorizated,function(req,res){
	Comment.findById(req.params.comment_id,function(err,comment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{ photo_id:req.params.id,
										 comment:comment

			});
		}
	});
	
})

router.put("/:comment_id",isCommentAuthorizated,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			console.log(err);
		}else{
			res.redirect("/photos/"+req.params.id);
		}
	})
});

//destroy comment route
router.delete("/:comment_id",isCommentAuthorizated,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/photos/"+req.params.id);
		}
	})
})

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function isCommentAuthorizated(req,res,next){
	// is logged in? if not, redict, if it does, show the edit page
	if(req.isAuthenticated()){
		//check authorization
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(req.user &&foundComment.author.id &&foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					res.redirect("back");
				}		
			}
		});
	}else{
		res.redirect("back");
	}
}

module.exports = router;