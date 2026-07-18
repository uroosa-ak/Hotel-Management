//import//
const express = require('express');
const dotenv=require('dotenv');
const ConnectDB = require('./config/db');
dotenv.config();
const mongoose = require("mongoose");
const session = require("express-session");
const app = express()
app.use(express.json());
ConnectDB();
//Middelwear//
app.use('/api/user',require ('./Routes/UserRoutes') )
app.use('/api/service',require ('./Routes/ServiceRoutes') )
app.use('/api/booking',require ('./Routes/BookingRoutes') )
app.use('/api/rooms',require ('./Routes/RoomsRoutes') )
app.use('/api/guest',require ('./Routes/GuestRoutes') )
app.use('/api/payment',require ('./Routes/PaymentRoutes') )
app.use("/api/checkinout", require("./routes/CheckInOutRoutes"));
app.use("/api/roles", require("./routes/RoleRoutes"));
app.use("/api/promotions", require("./routes/PromotionRoutes"));
app.use("/api/loyalty", require("./routes/LoyaltyProgramRoutes"));
app.use("/api/roomphotos", require("./routes/RoomPhotoRoutes"));
app.use("/api/taxes", require("./routes/TaxConfigurationRoutes"));
app.use("/api/paymentaudit", require("./routes/PaymentAuditRoutes"));
app.use("/api/maintenance", require("./routes/MaintenanceRequestRoutes"));
app.use("/api/eventbookings", require("./routes/EventBookingRoutes"));
app.use("/api/notifications", require("./routes/NotificationRoutes"));
app.use("/api/inventory", require("./routes/InventoryRoutes"));

app.use(express.urlencoded({extented: false}));
app.set("view engine","ejs");
app.use(session({
    secret: "hotel-secret",
    resave: false,
    saveUninitialized: false
}));
secret: process.env.SESSION_SECRET
//routes//
app.get('/', (req, res) => {
  res.send('Hello World!')
})
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})