var mongoose   = require("mongoose");

var photoSchema = new mongoose.Schema({
	name:String,
	src:String,
	des:String,
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

var PhotoModel = mongoose.model("PhotoModel",photoSchema);
module.exports = PhotoModel;