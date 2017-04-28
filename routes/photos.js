var express = require("express");
var router = express.Router();
var PhotoModel = require("../models/photoModel");

router.post("/",isLoggedIn,function(req,res){
	var name = req.body.name;
	var src = req.body.src;
	var des = req.body.des;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newPhoto = {name:name,src:src,des:des,author:author};
	
	PhotoModel.create(newPhoto,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/photos");
		}
	})
});

router.get("/upload",isLoggedIn,function(req,res){
	res.render("photos/upload");
});

router.get("/",function(req,res){
	PhotoModel.find({},function(err,photoCollection){
		if(err){
			console.log(err);
		}else{
			res.render("photos/photopage",{photos:photoCollection});
		}
	})
});
router.get("/:id",function(req,res){
	PhotoModel.findById(req.params.id).populate("comments").exec(function(err,foundPhoto){
		if(err){
			console.log(err);
		}else{
			res.render("photos/show",{photo:foundPhoto});

		}
	});

});

router.get("/:id/edit",isAuthorizated,function(req,res){
	PhotoModel.findById(req.params.id,function(err,foundPhoto){
			res.render("photos/edit",{photo:foundPhoto});
	});
});

router.put("/:id",isAuthorizated,function(req,res){
	PhotoModel.findByIdAndUpdate(req.params.id,req.body.photo,function(err,updatedPhoto){
		if(err){
			res.redirect("/photos");
		}else{
			res.redirect("/photos/" + req.params.id);
		}
	})
});

router.delete("/:id",isAuthorizated,function(req,res){
	PhotoModel.findByIdAndRemove(req.params.id,function(err){
		res.redirect("/photos");
	})
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function isAuthorizated(req,res,next){
	// is logged in? if not, redict, if it does, show the edit page
	if(req.isAuthenticated()){
		//check authorization
		PhotoModel.findById(req.params.id,function(err,foundPhoto){
			if(err){
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
		res.redirect("back");
	}
}
module.exports = router;