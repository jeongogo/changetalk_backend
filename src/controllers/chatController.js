const Chat = require('../model/chatModel');
const User = require('../model/userModel');

module.exports.getChats = async (req, res, next) => {
  try {
    const id = req.params.id;
  
    const chats = await Chat.find({ $or: [{ 'creator': { '$in': id } }, { 'users': { '$in': id } }]});

    const list = chats.map(async (item) => {
      const userList = item.users.map(async (user) => {
        return await User.findOne({ _id: user });
      });
      const userData = await Promise.all(userList);
      item.users = userData;
      return item;
    });

    const data = await Promise.all(list);
    
    return res.json({ data });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getChat = async (req, res, next) => {
  try {
    const { currentUserId, chatUserId, count } = req.body;
    const users = [currentUserId, chatUserId];
    let currentCount = null;
    let getCount = 20;

    let chat = await Chat.findOne(
      { $and: [{ 'creator': { '$in': users } }, { 'users': { '$in': chatUserId } }] },
    );

    const totalCount = chat.messages.length;
    

    if (count === 'firstGet') {
      currentCount = totalCount - (getCount + 1);
      messages = chat.messages.slice(totalCount - getCount, totalCount);
    } else {
      currentCount = count;
      if (count === 0) {
        return;
      }
      if (currentCount < getCount) {
        currentCount = 0;
        getCount = 0;
      } else {
        currentCount = currentCount - (getCount + 1);
      }
      messages = chat.messages.slice(currentCount - getCount, count);
    }

    chat.messages = messages;
    

    if (chat === null) {
      return res.json({ state: false, chat: null });
    } else {
      return res.json({ state: true, chat: chat, count: currentCount });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.createChat = async (req, res, next) => {
  try {
    const { currentUserId, chatUserId } = req.body;
    const users = [currentUserId, chatUserId];

    const chat = await Chat.create({
      creator: currentUserId,
      users,
    });

    return res.json({ chat });
  } catch (ex) {
    next(ex);
  }
};

module.exports.sendMassage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { messageId, from, content, sendDate } = req.body;

    const chat = await Chat.findByIdAndUpdate(id , {
      $push: {
        messages: {
          messageId,
          from,
          content,
          sendDate
        }
      }
    });
  } catch (ex) {
    next(ex);
  }
};