const mongoose = require('mongoose')

const guildSchema = mongoose.Schema({
  _id: { type: String, required: false },
  prefix: { type: String, required: false, default: '-' },
  Language: { type: String, required: false, default: 'zh-TW' },
})

module.exports = mongoose.model('Gulids', guildSchema)
