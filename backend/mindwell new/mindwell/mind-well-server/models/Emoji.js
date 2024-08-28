const mongoose = require('mongoose');

const EmojiSchema = new mongoose.Schema({
  emoji: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emoji', EmojiSchema);
