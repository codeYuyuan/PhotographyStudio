var express    = require("express");
var app        = express();
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/photostudio");
app.use(express.static(__dirname + ""));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

var photoSchema = new mongoose.Schema({
	name:String,
	src:String,
	des:String
});

var PhotoModel = mongoose.model("PhotoModel",photoSchema);
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
	res.render("upload");
});

app.get("/photos",function(req,res){
	PhotoModel.find({},function(err,photoCollection){
		if(err){
			console.log(err);
		}else{
			res.render("photopage",{photos:photoCollection});
		}
	})
app.get("/photos/:id",function(req,res){
	PhotoModel.findById(req.params.id,function(err,foundPhoto){
		if(err){
			console.log(err);
		}else{
			res.render("show",{photo:foundPhoto});

		}
	});

})


	
});
app.listen("3000",function(){
	console.log("Server started!");
});