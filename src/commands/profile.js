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
    const applyInt = (canvas, text) => {
      const context = canvas.getContext('2d')
      let fontSize = 18

      do {
        context.font = `${(fontSize -= 1)}px Gen Jyuu GothicX Medium`
      } while (context.measureText(text).width > canvas.width - 400)

      return context.font
    }

    const canvas = Canvas.createCanvas(699, 497)
    const context = canvas.getContext('2d')
    const background = await Canvas.loadImage(
      'https://cdn.discordapp.com/attachments/851788198467338242/916618115662610442/44ff63d4df086bea4180dee6bbe39b31.png'
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
    console.log(User.屬性['ATK'])
    context.font = applyInt(canvas, `${User.屬性['ATK']}`)
    context.fillStyle = '#302008'
    context.fillText(`${User.屬性['ATK']}`, 204, 284)
    context.font = applyInt(canvas, `${User.屬性['DEF']}`)
    context.fillStyle = '#302008'
    context.fillText(`${User.屬性['DEF']}`, 204, 310)
    context.font = applyInt(canvas, `${User.屬性['HP']}`)
    context.fillStyle = '#302008'
    context.fillText(`${User.屬性['HP']}`, 204, 339)
    context.font = applyInt(canvas, `${User.屬性['INT']}`)
    context.fillStyle = '#302008'
    context.fillText(`${User.屬性['INT']}`, 204, 368)
    context.font = applyInt(canvas, `${User.屬性['MP']}`)
    context.fillStyle = '#302008'
    context.fillText(`${User.屬性['MP']}`, 204, 397)
    context.font = applyInt(canvas, `${User.屬性['DEX']}`)
    context.fillStyle = '#302008'
    context.fillText(`${User.屬性['DEX']}`, 204, 426)
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
