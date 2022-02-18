const mongoose = require("mongoose");
var validator = require('validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema( {
  email: {
  type: String,
  trim: true,
  lowercase: true,
      unique: true,

  
},



googleid: {
  type: String,
  required:true,

},

})

const User = mongoose.model("Auth",UserSchema);
module.exports=User


