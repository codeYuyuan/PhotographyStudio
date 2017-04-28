var PhotoModel = require("../models/photoModel");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.isAuthorizated = function(req,res,next){
	if(req.isAuthenticated()){
			//check authorization
			PhotoModel.findById(req.params.id,function(err,foundPhoto){
				if(err){
					req.flash("error","Photo not found")
					res.redirect("back");
				}else{
					if(req.user&&foundPhoto.author.id.equals(req.user._id)){
						next();
						
					}else{
						res.redirect("back");
					}		
				}
			});
		}else{
			res.flash("error","You need to be logged in to do that");
			res.redirect("back");
		}
};
middlewareObj.isCommentAuthorizated = function(req,res,next){
	if(req.isAuthenticated()){
		//check authorization
		Comment.findById(req.params.comment_id,function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(req.user &&foundComment.author.id &&foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","Permission denied!")
					res.redirect("back");
				}		
			}
		});
	}else{
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;