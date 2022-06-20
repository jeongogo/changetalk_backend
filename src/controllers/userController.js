const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
  try {
    const { userid, username, password } = req.body;
  
    const useridCheck = await User.findOne({ userid });
    if (useridCheck) {
      return res.json({ msg: 'Username already used', status: false });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userid,
      username,
      password: hashedPassword,
    });
  
    return res.json({ status: true, user })
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { userid, password } = req.body;
  
    const user = await User.findOne({ userid });
    if (!user) {
      return res.json({ msg: 'Incorrect userid or password', status: false });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: 'Incorrect userid or password', status: false });
    }

    delete user.password;

    return res.json({ status: true, user });
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