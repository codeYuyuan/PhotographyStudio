var mongoose = require("mongoose");
var PhotoModel = require("./models/photoModel");
var Comment = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        src: "https://image.ibb.co/bWHtJ5/on_The_Top_Of_Great_Wall.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa", 
        src: "http://www.desktopas.com/files/2013/09/Russian-Blue-Cat-11-1800x1200.jpg",
        description: "blah blah blah"
    },
    {
        name: "Vancouver Skyline", 
        src: "/images/vancouverSkyline.jpg",
        description: "blah blah blah"
    }
]

function seedDB(){
	PhotoModel.remove({},function(err){
		if(err){
			console.log(err);
		}
		console.log("All photo removed!");
	})
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