const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authServices = require("../controllers/auth.controller");

router.get("/:id", authServices.protect, userController.getUserById);

router.put("/", authServices.protect, userController.updateUserById);

router.get("/", authServices.protect, userController.userprofile);

module.exports = router;
