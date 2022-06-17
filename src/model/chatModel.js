const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    creator: {
      type: String,
      required: true,
    },
    users: {
      type: Array,
    },
    messages: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chats', ChatSchema);