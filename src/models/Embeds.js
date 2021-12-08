const { MessageEmbed } = require('discord.js')

class Embeds {
  /**
   * Send a custom embed
   * @param {import("../base/CC-RPG-Client")} bot
   * @param {import("discord.js").Message.channel} Channel
   * @param {string} text
   */
  msgInfo (bot, Channel, text) {
    Channel.send({
      embeds: [
        new MessageEmbed().setColor(bot.config.EmbedColor).setDescription(text)
      ]
    })
  }
  /**
   * Send a custom embed
   * @param {import("../base/CC-RPG-Client")} bot
   * @param {import("discord.js").Message.channel} Channel
   * @param {string} text
   */
  msgError (Channel, text) {
    Channel.send({
      embeds: [
        new MessageEmbed().setTitle('<:gura:916521356370251796> 《神意》資訊面板').setColor('RED').setDescription(text)
      ]
    })
  }

  CmdUsage (bot, message, cmdName) {
    const cmd = bot.slashCommands.get(cmdName)
    const cmdUsage = cmd.usage ? `\/${cmd.name} ${cmd.usage}` : `\/${cmd.name}`

    const embed = new MessageEmbed()
      .setAuthor(
        `${cmd.category} 指令： ${cmd.name}`,
        bot.user.displayAvatarURL()
      )
      .addField(`${cmdUsage}`, `${cmd.description ?? '尚未註明，ㄏㄏ'}`)
      .setFooter('提示： [] 為非必填 • <> 為必填 • | 為擇一')

    let subcmd = cmd.subCommands
    if (subcmd && subcmd.length >= 1) {
      for (let s = 0; s < subcmd.length; s++) {
        embed.addField('** **', `**\/${cmd.name} ${subcmd[s]}`)
      }
    }
    message.channel.send({ embeds: [embed] })
  }
}
module.exports = new Embeds()
