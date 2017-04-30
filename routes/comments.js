var express = require("express");
var router = express.Router({mergeParams:true});
var PhotoModel = require("../models/photoModel");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){
	PhotoModel.findById(req.params.id,function(err,photo){
		if(err){
			console.log(err);
		}else{
			res.render("comments/newcomment",{photo:photo});
		}
	})
});
//create router
router.post("/",middleware.isLoggedIn,function(req,res){
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
					req.flash("success","Leave a comment successfully")
					res.redirect("/photos/"+photo.id);
				}
			})
		}
	});
});

router.get("/:comment_id/edit",middleware.isCommentAuthorizated,function(req,res){
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

router.put("/:comment_id",middleware.isCommentAuthorizated,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			console.log(err);
		}else{
			res.redirect("/photos/"+req.params.id);
		}
	})
});

//destroy comment route
router.delete("/:comment_id",middleware.isCommentAuthorizated,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted successfully");
			res.redirect("/photos/"+req.params.id);
		}
	})
})



module.exports = router;