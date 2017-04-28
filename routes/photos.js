var express = require("express");
var router = express.Router();
var PhotoModel = require("../models/photoModel");
var middleware = require("../middleware")

router.post("/",middleware.isLoggedIn,function(req,res){
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

router.get("/upload",middleware.isLoggedIn,function(req,res){
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

router.get("/:id/edit",middleware.isAuthorizated,function(req,res){
	PhotoModel.findById(req.params.id,function(err,foundPhoto){
		res.render("photos/edit",{photo:foundPhoto});
	});
});

router.put("/:id",middleware.isAuthorizated,function(req,res){
	PhotoModel.findByIdAndUpdate(req.params.id,req.body.photo,function(err,updatedPhoto){
		if(err){
			res.redirect("/photos");
		}else{
			res.redirect("/photos/" + req.params.id);
		}
	})
});

router.delete("/:id",middleware.isAuthorizated,function(req,res){
	PhotoModel.findByIdAndRemove(req.params.id,function(err){
		res.redirect("/photos");
	})
});


module.exports = router;