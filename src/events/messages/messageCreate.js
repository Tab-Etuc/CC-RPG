const Guilds = require('../../models/mongoDB/Guilds.js'),
  CheckLevelUp = require('../../models/CheckLevelUp.js')

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute (bot, message) {
    if (message.author.bot || !message.guild) return //如果是機器人發出的訊息、不在公會裡 就不執行
    try {
      await CheckLevelUp(bot, message)
      await RunCommand(bot, message)
    } catch {}
  }
}
async function RunCommand (bot, message) {
  let prefix = bot.config.DefaultPrefix
  let GuildData = await Guilds.findOne({
    _id: message.guildId
  })
  // 如果沒有伺服器資料，則創建
  if (!GuildData) {
    new Guilds({
      _id: message.guildId
    }).save()
  }
  if (GuildData && GuildData.prefix) prefix = GuildData.prefix

  const prefixMention = new RegExp(`^<@!?${bot.user.id}> `)
  prefix = message.content.match(prefixMention)
    ? message.content.match(prefixMention)[0]
    : prefix

  const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g),
    //Making the command lowerCase because our file name will be in lowerCase
    command = args.shift().toLowerCase(),
    //Searching a command
    cmd =
      bot.commands.get(command) ||
      bot.commands.find(x => x.aliases && x.aliases.includes(command))
  if (cmd) {
    if (message.content.indexOf(prefix) !== 0) return

    cmd.run(bot, message, args, GuildData)
  }
}
