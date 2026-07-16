const { Schema, default: mongoose } = require("mongoose");


const bookingSchema = new Schema(
{

    guest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest",
        required: true
    },


    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },


    checkInDate: {
        type: Date,
        required: true
    },


    checkOutDate: {
        type: Date,
        required: true
    },


    numberOfGuests: {
        type: Number,
        default: 1
    },


    bookingStatus: {

        type: String,

        enum:[
            "pending",
            "confirmed",
            "checked-in",
            "checked-out",
            "cancelled"
        ],

        default:"pending"
    },


    totalAmount:{
        type:Number,
        default:0
    },


    paymentStatus:{

        type:String,

        enum:[
            "pending",
            "paid",
            "partial"
        ],

        default:"pending"
    },


    specialRequest:{
        type:String,
        default:""
    },


    createdAt:{
        type:Date,
        default:Date.now
    }


});


module.exports = mongoose.model("Booking",bookingSchema);