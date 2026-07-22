const express = require ("express");
const routes = express.Router();
const User = require("../models/User");
// IMPORT the controller
const userController = require("../Controller/userController");
routes.post("/register",userController.register)
routes.post("/login",userController.login)





module.exports = routes