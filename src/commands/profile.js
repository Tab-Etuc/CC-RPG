const { MessageButton, MessageActionRow } = require('discord.js'),
  Users = require('../models/mongoDB/Users.js'),
  Bar = require('../models/Bar')
module.exports = {
  name: 'profile',
  description: '查看冒險者卡片',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['p'],
  /**
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  run: async (bot, message, args, GuildDB) => {
    let user = message.mentions.users.first() || message.author
    const User = await Users.findOne({ _id: user.id })
    if (!User) {
      if (user == message.author) {
        return bot.say.msgError(
          message.channel,
          `\`\`\`md\n- 你尚未降臨此世界\`\`\`\n **請先輸入\`${GuildDB.prefix}start\`！**`
        )
      } else {
        return bot.say.msgError(
          message.channel,
          `\`\`\`md\n- 查無對象資料\`\`\``
        )
      }
    }
    const HPBar = Bar(User.HP, User.THP, 'HP'),
      MPBar = Bar(User.MP, User.TMP, 'MP')

    let Equipments = '```md\n'

    User.裝備[0]
      ? User.裝備.forEach(
          element => (Equipments = Equipments + '- ' + element + '\n')
        )
      : (Equipments += '無')

    const msg = message.reply({
        embeds: [
          bot.say
            .msgInfo(
              `\`\`\`md\n# 稀有技能 -「數學者」權能\n\`\`\`\n**血量：**\n${HPBar.Bar} \`${User.HP}/${User.THP}\` \`${HPBar.percentageText}\`\n**魔力值：**\n${MPBar.Bar} \`${User.MP}/${User.TMP}\` \`${MPBar.percentageText}\`\n\`\`\`md\n# 屬性狀態\n- [ATK] 物理攻擊力> ${User.屬性['ATK']}\n- [DEF] 防禦力> ${User.屬性['DEF']}\n- [INT] 智力> ${User.屬性['INT']}\n- [DEX] 敏捷> ${User.屬性['DEX']}\n\`\`\``
            )
            .setThumbnail(user.displayAvatarURL())
            .setFields([
              {
                name: '[等級]',
                value: User.等級.toString(),
                inline: true
              },
              {
                name: '[評級]',
                value: User.評級,
                inline: true
              },
              {
                name: '[種族]',
                value: User.種族,
                inline: true
              },
              {
                name: '[經驗值]',
                value:
                  User.經驗值.toString() + '/' + User.升等所需經驗值.toString(),
                inline: true
              },
              {
                name: '[金錢]',
                value: User.金錢.toString(),
                inline: true
              },
              {
                name: '[業力]',
                value: User.業力.toString(),
                inline: true
              },
              {
                name: '[裝備]',
                value: Equipments + '```'
              }
            ])
        ],
        ephemeral: false,
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId('profileQuest' + message.id)
              .setLabel('任務')
              .setStyle('PRIMARY'),
            new MessageButton()
              .setCustomId('profileAppraisal' + message.id)
              .setLabel('考核')
              .setStyle('DANGER')
              .setDisabled(true)
          )
        ]
      }),
      filter = i =>
        (i.customId === 'profileQuest' + message.id ||
          i.customId === 'profileAppraisal' + message.id) &&
        i.user.id === message.author.id,
      collector = message.channel.createMessageComponentCollector({
        filter,
        time: 60000
      })
    let a = true
    collector.on('collect', async i => {
      switch (i.customId) {
        case 'profileQuest' + message.id:
          a = false
          bot.commands.get('quest').run(bot, message, args, GuildDB)
          ;(await msg).delete().catch(err => console.log(err))
          break
        case 'profileAppraisal' + message.id:
          a = false
          break
      }
    })
    collector.on('end', async collected => {
      if (a)
        (await msg).edit({
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId('profileQuest' + message.id)
                .setLabel('任務')
                .setStyle('PRIMARY')
                .setDisabled(true),
              new MessageButton()
                .setCustomId('profileAppraisal' + message.id)
                .setLabel('考核')
                .setStyle('DANGER')
                .setDisabled(true)
            )
          ]
        })
    })
  }
}
