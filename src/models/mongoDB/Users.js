const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
  _id: { type: String, required: false },
  業力: { type: Number, required: false, default: 0 },
  陣營: { type: String, required: false },
  種族: { type: String, required: false },
  裝備: { type: Array, required: false, default: [] },
  背包: { type: Array, required: false, default: [] },
  等級: { type: Number, required: false, default: 1 },
  評級: { type: String, required: false, default: 'E' },
  經驗值: { type: Number, required: false, default: 1 },
  升等所需經驗值: { type: Number, required: false, default: 100 },
  金錢: { type: Number, required: false, default: 0 },
  技能: { type: Array, required: false, default: ['數學者'] },
  TMP: { type: Number, required: false, default: 100 }, // 總共的魔力值
  MP: { type: Number, required: false, default: 100 }, // 魔力值
  THP: { type: Number, required: false, default: 100 }, //總共的血量
  HP: { type: Number, required: false, default: 100 }, // 血量
  屬性: { type: Object, required: false },
  事件紀錄: {
    type: Object,
    required: false,
    default: { 完成任務數: { 總共: 0 } }
  },
  創建於: { type: String, required: false }
})

module.exports = mongoose.model('Users', usersSchema)
