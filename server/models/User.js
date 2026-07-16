const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema({
    username: {
        type:String,
        required: true
    },
email:{
    type:String,
    required: true,
    unique:true
},
password:{
    type:String,
    required: true
},
role:{
    type:String,
    enum:["manager",'housekeeping','guest'],
    default:"guest"
},
contact:{
    type:String,
    default:"no contact"
},
age:{
    type:Number,
    default:0
    
}

})
module.exports = mongoose.model("user",userSchema)