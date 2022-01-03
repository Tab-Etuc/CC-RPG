const Users = require('../../models/mongoDB/Users')
module.exports = [
  {
    name: '銅',
    description: '最普遍的礦物。作為世界通用貨幣，泛用性高。',
    canUse: false,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 1,
    price: 1,
    keep: false,
    run: async (bot, message, args) => {}
  },
  {
    name: '鐵',
    description: '一百銅能兌換一鐵。作為世界通用貨幣，泛用性高。',
    canUse: false,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 100,
    price: 100,
    keep: false,
    run: async (bot, message, args) => {}
  },
  {
    name: '金',
    description: '一千鐵能兌換一金。作為世界通用貨幣，泛用性高。',
    canUse: false,
    canBuy: true,
    displayOnShop: true,
    sellAmount: 100,
    price: 100000,
    keep: false,
    run: async (bot, message, args) => {}
  },
  {
    name: '小型紅藥水',
    description: '飲用可回復100滴血量。',
    canUse: true,
    canBuy: true,
    displayOnShop: false,
    sellAmount: 20,
    price: 100,
    keep: false,
    run: async (bot, message, args) => {
      const user = await Users.findOne({ _id: message.author.id })
      const a = user.THP - user.HP // 125 - 125 or 125 - 1 or 125 -0
      
    }
  }
]
