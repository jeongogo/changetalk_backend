const router = require('express').Router();
const multer = require('multer');
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
router.get('/users', getAllUsers);
router.get('/:id', getUser);
router.post('/:id', setUser);
router.post('/profile/upload', uploadWithOriginalFilename.single('image'), imageUpload);
router.get('/search/:name', searchUser);
router.post('/friends/:id', addFriend);
router.get('/friends/:id', getFriends);

module.exports = router;