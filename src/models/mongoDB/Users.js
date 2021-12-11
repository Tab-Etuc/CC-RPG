const mongoose = require('mongoose')

const guldSchema = mongoose.Schema({
  _id: { type: String, required: false },
  業力: { type: Number, required: false },
  陣營: { type: String, required: false },
  種族: { type: String, required: false },
  裝備: { type: Array, required: false, default: [] },
  等級: { type: Number, required: false, default: 1 },
  評級: { type: String, required: false, default: 'E' },
  經驗值: { type: Number, required: false, default: 1 },
  升等所需經驗值: { type: Number, required: false, default: 100 },
  技能: { type: Array, required: false, default: ['數學者'] },
  屬性: { type: Object, required: false },
  升等增加之屬性: { type: Object, required: false },
  創建於: { type: String, required: false }
})

module.exports = mongoose.model('Users', guldSchema)
