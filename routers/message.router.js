const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const authServices = require("../controllers/auth.controller");

router.post('/', authServices.protect, messageController.sendMessage);

router.get('/', authServices.protect, messageController.getMessages);

module.exports = router;
