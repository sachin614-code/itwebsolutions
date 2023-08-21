const express = require("express");
const router = express.Router();
const loginController = require("../controller/auth/login.controller");
const registerController = require("../controller/auth/register.controller");
const { authenticated } = require("../middlewares/authenticated.middleware");

router.get("/login", loginController.index);

router.post("/login", loginController.login);

router.get("/register", registerController.index);

router.post("/register", registerController.register);

router.get("/logout", loginController.logout);



module.exports = router;
