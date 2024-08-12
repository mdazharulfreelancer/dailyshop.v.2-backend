const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { ChatController, UserChat, FindChat, GetMessageController, MessageController } = require('../controller/chatController');

const router = express.Router();
// // upload imadge
cloudinary.config({
    cloud_name: 'daxvmjaff',
    api_key: '349718663461614',
    api_secret: 'L2T3hMpJNGFmPK8UysYBNrELsSM',
});

const storage = multer.memoryStorage();
const upload = multer({
    storage : storage,
    limits : { fileSize : 1024 * 1024}}).array('messageimage',5)

router.post('/chat', ChatController);
router.get('/chat/:userId',  UserChat);
router.post('chat/:firstId/:secoundId', FindChat);

//message
router.post('/chat/message', MessageController);
router.get('/chat/message/:chatId', GetMessageController);

module.exports = router;