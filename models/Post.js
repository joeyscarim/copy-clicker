const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create our schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text: {
    type: String
  },
  body: {
    type: String
  },
  subject: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      name: {
        type: String,
        required: true
      },
      avatar: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
