const router = require('express').Router();
const multer = require('multer');
const checkLoggedIn = require('../lib/checkLoggedIn');
const { login, register, addFriend, getUser, setUser, imageUpload, searchUser, getFriends, getAllUsers } = require('../controllers/userController');

const storage  = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});

var uploadWithOriginalFilename = multer({ storage: storage });

router.post('/login', login);
router.post('/register', register);
router.get('/users', checkLoggedIn, getAllUsers);
router.get('/:id', checkLoggedIn, getUser);
router.post('/:id', checkLoggedIn, setUser);
router.post('/profile/upload', checkLoggedIn, uploadWithOriginalFilename.single('image'), imageUpload);
router.get('/search/:name', searchUser);
router.post('/friends/:id', checkLoggedIn, addFriend);
router.get('/friends/:id', checkLoggedIn, getFriends);

module.exports = router;