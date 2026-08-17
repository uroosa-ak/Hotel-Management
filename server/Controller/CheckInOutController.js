const CheckInOut = require("../models/CheckInOut");


// CREATE
exports.createCheckInOut = async(req,res)=>{
    try{

        const data = await CheckInOut.create(req.body);

        res.status(201).json({
            success:true,
            message:"Check In created successfully",
            data
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};



// GET ALL

exports.getAllCheckInOuts = async(req,res)=>{

    try{

        const data = await CheckInOut
        .find()
        .populate("guest room booking")
        .sort({createdAt:-1});


        res.json({
            success:true,
            count:data.length,
            data
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};




// GET SINGLE


exports.getCheckInOutById = async(req,res)=>{

try{

const data = await CheckInOut
.findById(req.params.id)
.populate("guest room booking");


if(!data){

return res.status(404).json({
message:"Record not found"
});

}


res.json({
success:true,
data
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};




// GET BY GUEST


exports.getByGuest = async(req,res)=>{

try{

const data = await CheckInOut
.find({
guest:req.params.guestId
})
.populate("guest room booking");


res.json({
success:true,
data
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};





// GET BY BOOKING


exports.getByBooking = async(req,res)=>{

try{


const data = await CheckInOut
.find({
booking:req.params.bookingId
})
.populate("guest room booking");


res.json({
success:true,
data
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};





// ACTIVE CHECKINS


exports.getActiveCheckIns = async(req,res)=>{

try{


const data = await CheckInOut
.find({
status:"CHECKED_IN"
})
.populate("guest room booking");


res.json({
success:true,
count:data.length,
data
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};






// SEARCH DATE


exports.getByDate = async(req,res)=>{

try{

const {date}=req.query;


const start=new Date(date);
const end=new Date(date);

end.setDate(end.getDate()+1);


const data=await CheckInOut.find({

checkInDate:{
$gte:start,
$lt:end
}

})
.populate("guest room booking");



res.json({
success:true,
data
});


}catch(error){

res.status(500).json({
message:error.message
});

}


};







// UPDATE


exports.updateCheckInOut=async(req,res)=>{

try{


const updated=
await CheckInOut.findByIdAndUpdate(
req.params.id,
req.body,
{
new:true
}
);


res.json({

success:true,
message:"Updated successfully",
data:updated

});


}catch(error){

res.status(500).json({
message:error.message
});

}

};







// CHECKOUT


exports.checkOutGuest=async(req,res)=>{


try{


const updated=
await CheckInOut.findByIdAndUpdate(

req.params.id,

{

status:"CHECKED_OUT",

checkOutDate:new Date()

},

{
new:true
}

);



res.json({

success:true,
message:"Guest checked out",
data:updated

});


}catch(error){

res.status(500).json({
message:error.message
});

}


};







// DELETE


exports.deleteCheckInOut=async(req,res)=>{

try{


await CheckInOut.findByIdAndDelete(req.params.id);


res.json({

success:true,
message:"Deleted successfully"

});


}catch(error){

res.status(500).json({
message:error.message
});

}

};