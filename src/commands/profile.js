const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageAttachment
} = require('discord.js')
const Users = require('../models/mongoDB/Users.js')
const { resolve, join } = require('path')

const Canvas = require('canvas')
const { registerFont } = require('canvas')
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
    if (bot.config.Test == false) {
      registerFont(
        resolve(
          join(__dirname, '../../../assets/Fonts/GenJyuuGothicX-Medium.ttf')
        ),
        { family: 'GenJyuuGothicX' }
      )
      registerFont(
        resolve(join(__dirname, '../../../assets/Fonts/Canterbury.ttf')),
        { family: 'Canterbury' }
      )
    }
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
    const applyText = (canvas, text) => {
      const context = canvas.getContext('2d')
      let fontSize = 70

      do {
        context.font = `${(fontSize -= 5)}px Gen Jyuu GothicX Medium`
      } while (context.measureText(text).width > canvas.width - 400)

      return context.font
    }
    const fill屬性 = (canvas, text, height) => {
      const context = canvas.getContext('2d')
      context.fillStyle = '#302008'
      let width
      let fontSize
      switch (text.length) {
        case 1:
          fontSize = 17
          width = 206
          break
        case 2:
          fontSize = 15
          width = 201
          break
        case 3:
          fontSize = 13
          width = 198
          break
        case 4:
          fontSize = 13
          width = 195
          break
        default:
          fontSize = 5
          width = 195
          break
      }
      context.font = `${fontSize}px Gen Jyuu GothicX Medium`
      context.fillText(`${text}`, width, height)
    }
    const fill等級 = (canvas, text) => {
      const context = canvas.getContext('2d')
      context.fillStyle = '#302008'
      let width
      let height = 246
      let fontSize
      switch (text.length) {
        case 1:
          fontSize = 35
          width = 494
          break
        case 2:
          fontSize = 30
          width = 486
          break
        case 3:
          fontSize = 28
          width = 479
          break
        case 4:
          fontSize = 24
          width = 475
          break
        default:
          fontSize = 22
          width = 479
          break
      }
      context.font = `${fontSize}px Gen Jyuu GothicX Medium`
      context.fillText(`${text}`, width, height)
    }

    const canvas = Canvas.createCanvas(699, 497)
    const context = canvas.getContext('2d')
    const background = await Canvas.loadImage(
      'https://cdn.discordapp.com/attachments/918447949011357716/918471175762493490/44ff63d4df086bea4180dee6bbe39b31.png'
    )

    context.drawImage(background, 0, 0, canvas.width, canvas.height)

    context.font = applyText(
      canvas,
      `${message.member.nickname || message.author.username}`
    )
    context.fillStyle = '#302008'
    context.fillText(
      `${message.member.nickname || message.author.username}`,
      59.1,
      118.3
    )

    fill屬性(canvas, `${User.屬性['ATK']}`, 284)
    fill屬性(canvas, `${User.屬性['DEF']}`, 313)
    fill屬性(canvas, `${User.屬性['HP']}`, 339)
    fill屬性(canvas, `${User.屬性['INT']}`, 365)
    fill屬性(canvas, `${User.屬性['MP']}`, 393)
    fill屬性(canvas, `${User.屬性['DEX']}`, 420)

    fill等級(canvas, User.等級.toString())

    context.beginPath()
    context.arc(591.0, 141.0, 70, 0, Math.PI * 2, true)
    context.closePath()
    context.clip()
    const avatar = await Canvas.loadImage(
      message.author.displayAvatarURL({
        format: 'png',
        size: 256,
        dynamic: true
      })
    )
    context.drawImage(avatar, 521.0, 71.0, 140, 140)

    const attachment = new MessageAttachment(
      canvas.toBuffer(),
      'profile-image.png'
    )

    const msg = message.channel.send({
      files: [attachment],
      ephemeral: false,
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId('profileQuest')
            .setLabel('任務')
            .setStyle('PRIMARY')
            .setDisabled(true),
          new MessageButton()
            .setCustomId('profileAbility')
            .setLabel('屬性')
            .setStyle('PRIMARY')
            .setDisabled(true),
          new MessageButton()
            .setCustomId('profileDigitization')
            .setLabel('數值化')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('profileAppraisal')
            .setLabel('考核')
            .setStyle('DANGER')
            .setDisabled(true)
        )
      ]
    })

    const filter = i =>
      (i.customId === 'profileDigitization' ||
        i.customId === 'profileQuest' ||
        i.customId === 'profileAbility' ||
        i.customId === 'profileAppraisal') &&
      i.user.id === message.author.id

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 60000
    })
    let a = true
    collector.on('collect', async i => {
      let Equipments = '```md\n'
      if (User.裝備[0]) {
        User.裝備.forEach(
          element => (Equipments = Equipments + '- ' + element + '\n')
        )
      } else {
        Equipments += '無'
      }

      switch (i.customId) {
        case 'profileQuest':
          break
        case 'profileAbility':
          break
        case 'profileDigitization':
          a = false
          ;(await msg).delete().catch()
          await i.channel.send({
            ephemeral: false,
            embeds: [
              bot.say
                .msgInfo(
                  `\`\`\`md\n# 稀有技能 -「數學者」權能\n\`\`\`\n\`\`\`md\n# 屬性\n- [ATK] 物理攻擊力> ${User.屬性['ATK']}\n- [DEF] 防禦力> ${User.屬性['DEF']}\n- [HP] 血量> ${User.屬性['HP']}\n- [INT] 智力> ${User.屬性['INT']}\n- [MP] 魔力值> ${User.屬性['MP']}\n- [DEX] 敏捷> ${User.屬性['DEX']}\n\`\`\``
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
                    value: User.經驗值.toString(),
                    inline: true
                  },
                  {
                    name: '[升等所需經驗值]',
                    value: User.升等所需經驗值.toString(),
                    inline: true
                  },
                  {
                    name: '[裝備]',
                    value: Equipments + '```'
                  }
                ])
            ]
          })
          break
        case 'profileAppraisal':
          break
      }
    })

    collector.on('end', async collected => {
      console.log('time oy')
      if (a)
        (await msg).edit({
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId('profileQuest')
                .setLabel('任務')
                .setStyle('PRIMARY')
                .setDisabled(true),
              new MessageButton()
                .setCustomId('profileAbility')
                .setLabel('屬性')
                .setStyle('PRIMARY')
                .setDisabled(true),
              new MessageButton()
                .setCustomId('profileDigitization')
                .setLabel('數值化')
                .setStyle('PRIMARY')
                .setDisabled(true),
              new MessageButton()
                .setCustomId('profileAppraisal')
                .setLabel('考核')
                .setStyle('DANGER')
                .setDisabled(true)
            )
          ]
        })
    })
  }
}
