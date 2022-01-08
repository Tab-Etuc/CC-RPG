const fs = require('fs')

module.exports = {
  name: 'help',
  description: '幫助頁面',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['h'],
  /**
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  run: async (bot, message, args, GuildDB) => {
    let Fields = [],
      Field = {}

    const commandFiles = fs
      .readdirSync('./src/commands')
      .filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
      const command = require(`./${file}`)
      Field.name = command.name
      Field.value = `\`${command.description}\``
      Field.inline = true
      Fields.push(Field)
      Field = {}
    }
    message.reply({
      embeds: [
        bot.say.msgInfo(`\`\`\`md\n# 指令列表\n\`\`\``).setFields(Fields)
      ]
    })
  }
}
