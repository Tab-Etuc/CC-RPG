const { MessageAttachment } = require('discord.js')
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
  aliases: ['s'],
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
    const User = await Users.findOne({ _id: message.author.id })
    if (!User)
      return bot.say.msgError(
        message.channel,
        '```md\n- 你尚未降臨此世界```\n **請先輸入`Cstart`！**'
      )
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
          fontSize = 30
          width = 479
          break
        default:
          fontSize = 25
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

    message.channel.send({
      files: [attachment]
    })
  }
}
