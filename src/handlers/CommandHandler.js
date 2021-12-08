const glob = require('glob')
module.exports = async function loadCommands (bot) {
  const msgCommandFiles = glob.sync('./src/commands/**/*.js')

  // 訊息指令
  for (const file of msgCommandFiles) {
    const command = require(`../../${file}`)
    delete require.cache[require.resolve(`../../${file}`)]

    bot.commands.set(command.name, command)
    bot.logger.log('Msg-Commands', `${command.name}`)
  }
}
