const Users = require('./mongoDB/Users.js')
, Data = require('../assets/Data/ethnicity.json')

module.exports = async (bot, message) => {
  const user = await Users.findOne({ _id: message.author.id })
  if (!user) return
  const Level = user.等級
  while (user.經驗值 >= user.升等所需經驗值) {
    user.THP += Data[user.種族]['種族加成']['HP'] * (user.等級 * user.等級)
    user.TMP += Data[user.種族]['種族加成']['MP']
    user.屬性.ATK += Data[user.種族]['種族加成']['ATK']
    user.屬性.DEF += Data[user.種族]['種族加成']['DEF']
    user.屬性.INT += Data[user.種族]['種族加成']['INT']
    user.屬性.DEX += Data[user.種族]['種族加成']['DEX']

    user.經驗值 -= user.升等所需經驗值
    user.升等所需經驗值 = Math.floor(user.升等所需經驗值 * 1.25)
    user.等級 += 1

    user.HP = user.THP
    user.MP = user.TMP
  }
  if (user.等級 != Level) {
    await Users.updateOne(
      { _id: message.author.id },
      {
        THP: user.THP,
        HP: user.HP,
        TMP: user.TMP,
        MP: user.MP,
        經驗值: user.經驗值,
        升等所需經驗值: user.升等所需經驗值,
        等級: user.等級,
        '屬性.ATK': user.屬性.ATK,
        '屬性.DEF': user.屬性.DEF,
        '屬性.INT': user.屬性.INT,
        '屬性.DEX': user.屬性.DEX
      }
    ).catch(err => console.log(err))
    await message.channel.send({
      embeds: [bot.say.msgInfo(`\`\`\`md\n# 已升級！\n\`\`\``)]
    })
  }
}
