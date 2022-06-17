const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      min: 3,
      max: 20,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    avatarImage: {
      type: String,
      default: '../avatar_default.jpg',
    },
    stateMessage: {
      type: String,
      default: '',
    },
    friends: {
      type: Array,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Users', UserSchema);