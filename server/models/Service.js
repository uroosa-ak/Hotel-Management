const { Schema, default: mongoose } = require("mongoose");


const serviceSchema = new Schema(
{

    serviceName:{
        type:String,
        required:true
    },


    description:{
        type:String,
        default:""
    },


    category:{

        type:String,

        enum:[
            "food",
            "laundry",
            "transport",
            "room-service",
            "other"
        ],

        default:"other"

    },


    price:{
        type:Number,
        required:true
    },


    booking:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking"
    },


    status:{

        type:String,

        enum:[
            "available",
            "completed",
            "cancelled"
        ],

        default:"available"

    },


    createdAt:{
        type:Date,
        default:Date.now
    }


});


module.exports = mongoose.model("Service",serviceSchema);