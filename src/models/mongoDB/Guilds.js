const mongoose = require('mongoose')

const guldSchema = mongoose.Schema({
  _id: { type: String, required: false },
  prefix: { type: String, required: false, default: 'C' },
  Language: { type: String, required: false, default: 'zh-TW' },
})

module.exports = mongoose.model('Gulids', guldSchema)
