const { Schema, default: mongoose } = require("mongoose");


const paymentSchema = new Schema(
{

    booking:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Booking",
        required:true
    },


    guest:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Guest",
        required:true
    },


    amount:{
        type:Number,
        required:true
    },


    paymentMethod:{

        type:String,

        enum:[
            "cash",
            "card",
            "bank-transfer",
            "online"
        ],

        default:"cash"
    },


    transactionId:{
        type:String,
        default:""
    },


    paymentStatus:{

        type:String,

        enum:[
            "pending",
            "completed",
            "failed"
        ],

        default:"pending"
    },


    paymentDate:{
        type:Date,
        default:Date.now
    }


});


module.exports = mongoose.model("Payment",paymentSchema);