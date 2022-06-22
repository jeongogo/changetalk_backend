const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const bcrypt = require('bcrypt');

const generateToken = ({ _id }) => {
  const token = jwt.sign(
    { _id },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
  return token;
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
  
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: '동일한 이메일이 존재합니다.', status: false });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    user.password = undefined;
    
    const token = generateToken(user._id);
  
    return res.json({ status: true, user, token })
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: '이메일 혹은 비밀번호가 일치하지 않습니다.', status: false });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: '이메일 혹은 비밀번호가 일치하지 않습니다.', status: false });
    }

    user.password = undefined;

    const token = generateToken(user._id);

    return res.json({ status: true, user, token });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    return res.json(user);
  } catch (ex) {
    next(ex);
  }
}

module.exports.setUser = async (req, res, next) => {  
  try {
    const { username, stateMessage, avatarImage } = req.body;
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      { username, stateMessage, avatarImage },
      { new: true }
    );
    return res.json(user);
  } catch (ex) {
    next(ex);
  }
}

module.exports.imageUpload = async (req, res, next) => {  
  try {
    const image = req.file.path;

    if (image === undefined) {
      return res.json({ msg: '이미지가 존재하지 않습니다.' });
    }
    
    return res.json({ msg: '이미지 업로드 성공', image })
  } catch (ex) {
    next(ex);
  }
}

module.exports.searchUser = async (req, res, next) => {
  try {
    const users = await User.find({ username: req.params.name });
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
}

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
}

module.exports.getFriends = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const friends = await User.find({ _id: { '$in': user.friends }});
    return res.json(friends);
  } catch (ex) {
    next(ex);
  }
}

module.exports.addFriend = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id},
      { $push: { friends: req.body.id }},
      { new: true }
    );
    return res.json(user);
  } catch (ex) {
    next(ex);
  }
}