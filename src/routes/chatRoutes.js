const { getChats, getChat, createChat, sendMassage } = require('../controllers/chatController');

const router = require('express').Router();

router.get('/:id', getChats);
router.post('/', getChat);
router.post('/create', createChat);
router.post('/:id', sendMassage);

module.exports = router;