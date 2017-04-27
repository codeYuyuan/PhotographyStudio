var express = require("express");
var router = express.Router();
var PhotoModel = require("../models/photoModel");

router.post("/",function(req,res){
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

router.get("/upload",function(req,res){
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

module.exports = router;