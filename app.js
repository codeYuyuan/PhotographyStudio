var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(express.static(__dirname + ""));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/",function(req,res){
	res.render("landing");
});


var photoCollection = [
						{name:"test",src:"http://a2.att.hudong.com/63/25/01100000000000143974257333907_s.jpg"},
						{name:"test",src:"http://a2.att.hudong.com/63/25/01100000000000143974257333907_s.jpg"},
						{name:"test",src:"http://a2.att.hudong.com/63/25/01100000000000143974257333907_s.jpg"},
						{name:"test",src:"http://a2.att.hudong.com/63/25/01100000000000143974257333907_s.jpg"}
];

app.post("/photos",function(req,res){
	var name = req.body.name;
	var src = req.body.src;
	var newPhoto = {name:name,src:src};
	photoCollection.push(newPhoto);
	res.redirect("/photos");
});

app.get("/upload",function(req,res){
	res.render("upload");
});

app.get("/photos",function(req,res){
	res.render("photopage",{photos:photoCollection});
});
app.listen("3000",function(){
	console.log("Server started!");
});