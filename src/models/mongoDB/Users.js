const mongoose = require('mongoose')

const guldSchema = mongoose.Schema({
  _id: { type: String, required: false },
  區域: { type: String, required: false },
  種族: { type: String, required: false },
  裝備: { type: Array, required: false, default: [] },
  等級: { type: Number, required: false, default: 1 },
  經驗值: { type: Number, required: false, default: 1 },
  升等所需經驗值: { type: Number, required: false, default: 100 },
  技能: { type: Array, required: false },
  屬性: { type: Object, required: false },
  升等增加之屬性: { type: Object, required: false },
  創建於: { type: String, required: false}
})

module.exports = mongoose.model('Users', guldSchema)
