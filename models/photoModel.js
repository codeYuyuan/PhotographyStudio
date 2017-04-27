var mongoose   = require("mongoose");

var photoSchema = new mongoose.Schema({
	name:String,
	src:String,
	des:String,
	author:{
		id:{         
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

var PhotoModel = mongoose.model("PhotoModel",photoSchema);
module.exports = PhotoModel;