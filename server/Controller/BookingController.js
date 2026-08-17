exports.createBooking = async (req, res) => {
    try {
        res.json({
            message: "Booking created"
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};


exports.getAllBookings = async (req, res) => {
    try {
        res.json({
            message: "All bookings"
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
};


exports.getBookingById = async (req, res) => {
    try {
        res.json({
            id: req.params.id
        });
    } catch(error) {
        res.status(500).json({
            error:error.message
        });
    }
};


exports.updateBooking = async (req,res)=>{
    try{
        res.json({
            message:"Booking updated"
        });
    }
    catch(error){
        res.status(500).json({
            error:error.message
        });
    }
};


exports.deleteBooking = async(req,res)=>{
    try{
        res.json({
            message:"Booking deleted"
        });
    }
    catch(error){
        res.status(500).json({
            error:error.message
        });
    }
};


exports.updateBookingStatus = async(req,res)=>{
    try{
        res.json({
            message:"Status updated"
        });
    }
    catch(error){
        res.status(500).json({
            error:error.message
        });
    }
};


exports.cancelBooking = async(req,res)=>{
    try{
        res.json({
            message:"Booking cancelled"
        });
    }
    catch(error){
        res.status(500).json({
            error:error.message
        });
    }
};


exports.getUserBookings = async(req,res)=>{
    try{
        res.json({
            user:req.params.userId
        });
    }
    catch(error){
        res.status(500).json({
            error:error.message
        });
    }
};