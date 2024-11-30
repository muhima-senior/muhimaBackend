const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.post('/chat', chatController.startChat);
router.get('/getChats/:userId', chatController.listChats) 

module.exports = router;
