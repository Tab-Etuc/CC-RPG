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
  }
]
