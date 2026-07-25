const express = require ("express");
const routes = express.Router();
const User = require("../models/User");
// IMPORT the controller
const userController = require("../Controller/userController");
const authMiddleware = require("../Middleware/authMiddleware");
routes.get("/all",authMiddleware, userController.getUsers)
routes.get("/profile",authMiddleware, userController.getUserById)
routes.put("/updateUser",authMiddleware, userController.updateUser)
routes.delete("/deleteUser",authMiddleware, userController.deleteUser)
routes.post("/register",userController.register)
routes.post("/login",userController.login)





module.exports = routes