var mongoose = require("mongoose");
var PhotoModel = require("./models/photoModel");
var Comment = require("./models/comment");

var data = [];

function seedDB(){
	data.forEach(function(seed){
		PhotoModel.create(seed, function(err,photo){
			if(err){
				console.log(err);
			}else{
				console.log("add image");
				Comment.create({
					text: "It's amazing!",
					author: {
						username: "admin"
					}
				},function(err,comment){
					if(err){
						console.log(err);
					}else{
						photo.comments.push(comment);
						photo.save();
						console.log("create new comment");
					}
				})
			}
		})
	});
}

module.exports = seedDB;