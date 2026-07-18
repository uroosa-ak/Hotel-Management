const express = require ("express");
const routes = express.Router();
routes.post("/register",userController.register)
routes.post("/login",userController.login)





module.exports = routes