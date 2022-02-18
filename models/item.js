const mongoose = require("mongoose");
var validator = require('validator');

const Schema = mongoose.Schema;

const ItemSchema = new Schema( {


facebookid: {
    type: String,
    required:true,
    

  },


})

const Item = mongoose.model("Item",ItemSchema);
module.exports=Item


