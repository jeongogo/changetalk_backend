const router = require('express').Router();
const checkLoggedIn = require('../lib/checkLoggedIn');
const { getChats, getChat, createChat, sendMassage } = require('../controllers/chatController');

router.get('/:id', checkLoggedIn, getChats);
router.post('/', checkLoggedIn, getChat);
router.post('/create', checkLoggedIn, createChat);
router.post('/:id', checkLoggedIn, sendMassage);

module.exports = router;