const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const Users = require('../models/mongoDB/Users.js')

module.exports = {
  name: 'join',
  description: '加入陣營',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['j'],
  /**
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */

  run: async (bot, message, args, GuildDB) => {
    const user = await Users.findOne({ _id: message.author.id })
    if (!user)
      return bot.say.msgError(
        message.channel,
        `\`\`\`md\n- 你尚未降臨此世界\`\`\`\n **請先輸入\`${GuildDB.prefix}start\`！**`
      )
    if (user.陣營) {
      if (user.陣營 == '冒險者公會')
        return message.reply({
          embeds: [
            bot.say.msgInfo(
              `\`\`\`md\n# 您已加入冒險者公會！\n\n\`\`\`\n您可以接取公會張貼的「討罰」、「護衛」、「探索」……任務。\n隨著貢獻度的增加而開放更高難度的任務，您亦能委託製造「裝備」、「武器」等。\n請輸入\`${GuildDB.prefix}quest\` 以接取任務。\n輸入\`${GuildDB.prefix}profile\`以查看冒險者卡片。`
            )
          ]
        })
    }
    const msg = message.reply({
      ephemeral: false,
      embeds: [
        bot.say.msgInfo('```md\n# 請選擇您欲加入的陣營```').setFields([
          {
            name: '自由的象徵——冒險者公會',
            value:
              '加入冒險者公會後可接受公會張貼之任務以獲取報酬，並於實戰經驗中成長。\n冒險者可於各地設有冒險者分部的國家間自由行動，並且能獲得特別優待。\n當對自己實力有一定自信後，可參加冒險者公會主辦的考核，並能獲取接更高難度的任務權限。'
          },
          {
            name: '絕對的強權——阿斯克特帝國',
            value:
              '若您於阿斯克特帝國從軍，將執行皇帝的旨意，並不得有絲毫忤逆之心。\n您可於此獲得與軍職相稱的裝備、武器、必需品。'
          }
          // ,
          // {
          //   name: '不知道要寫甚麼——商人協會',
          //   value:
          //     '透過經商致富，您可透過金錢將敵人砸死、雇用下人以幫助您搜刮資源。\n加入商會，您在跨國境的交易中能減免關稅，遇到魔物時聲請傭兵討伐......'
          // }
        ])
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId('joinGuild')
            .setLabel('公會')
            .setStyle('PRIMARY'),

          new MessageButton()
            .setCustomId('joinEmpire')
            .setLabel('帝國')
            .setStyle('PRIMARY')
            .setDisabled(true)
        )
      ]
    })
    const filter = i =>
      (i.customId === 'joinGuild' || i.customId === 'joinEmpire') &&
      i.user.id === message.author.id

    const collector = message.channel.createMessageComponentCollector({
      filter,
      time: 15000
    })
    let a = true
    collector.on('collect', async i => {
      if (i.customId === 'joinGuild') {
        a = false
        ;(await msg).delete().catch(err=>console.log(err))
        await i.channel.send({
          embeds: [
            bot.say.msgInfo(
              `\`\`\`md\n# 您已加入冒險者公會！\n\n\`\`\`\n您可以接取公會張貼的「討罰」、「護衛」、「探索」……任務。\n隨著貢獻度的增加而開放更高難度的任務，您亦能委託製造「裝備」、「武器」等。\n請輸入\`${GuildDB.prefix}quest\` 以接取任務。\n輸入\`${GuildDB.prefix}profile\`以查看冒險者卡片。`
            )
          ]
        })
        user.陣營 = '冒險者公會'
        user.save()
      }
      if (i.customId === 'joinEmpire') {
      }
    })
  }
}
