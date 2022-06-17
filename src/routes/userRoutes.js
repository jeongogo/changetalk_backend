const { login, register, addFriend, getUser, setUser, searchUser, getFriends, getAllUsers } = require('../controllers/userController');

const router = require('express').Router();

router.post('/login', login);
router.post('/register', register);
router.get('/users', getAllUsers);
router.get('/:id', getUser);
router.post('/:id', setUser);
router.get('/search/:name', searchUser);
router.post('/friends/:id', addFriend);
router.get('/friends/:id', getFriends);

module.exports = router;