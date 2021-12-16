const { MessageButton, MessageActionRow } = require('discord.js')
const Users = require('../models/mongoDB/Users.js')
const Bar = require('../models/Bar')
const { getRandom, getBetweenRandom } = require('../models/Math')
const wait = require('util').promisify(setTimeout)

module.exports = {
  name: 'quest',
  description: '接取任務',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['q'],
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
      // 當查無用戶資料
      return bot.say.msgError(
        message.channel,
        `\`\`\`md\n- 你尚未降臨此世界\`\`\`\n **請先輸入\`${GuildDB.prefix}start\`！**`
      )
    if (user.事件紀錄['完成任務數']['總共'] == 0) {
      // 初始事件
      const msg = message.channel.send({
        embeds: [
          bot.say
            .msgInfo(`\`\`\`md\n# ☬初始任務☬\n\`\`\``)
            .setFields([
              {
                name: '✅ 目標',
                value: '前往採集一株「伊蒂絲藥草」\n並上繳至冒險者公會'
              },
              {
                name: '🎁 報酬',
                value: '新手特惠——\n鐵鎧甲x1, 鐵大劍x1, 背包x1',
                inline: true
              },
              {
                name: '🕐 耗時',
                value: '約 10 ~ 20 秒'
              },
              {
                name: '是否接取此任務？',
                value: '請使用下方按鈕回復。'
              }
            ])
            .setThumbnail(
              'https://cdn.discordapp.com/attachments/919503944764502057/919504785391120414/unknown.png'
            )
        ],
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId('questFirstAgree')
              .setLabel('同意')
              .setStyle('SUCCESS'),
            new MessageButton()
              .setCustomId('questFirstRejection')
              .setLabel('婉拒')
              .setStyle('DANGER')
          )
        ]
      })
      const filter = i =>
        (i.customId === 'questFirstAgree' ||
          i.customId === 'questFirstRejection') &&
        i.user.id === message.author.id

      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 60000
      })
      let a = true
      collector.on('collect', async i => {
        switch (i.customId) {
          case 'questFirstAgree': // 同意
            let Chance = getRandom(9) // 隨機亂數1~10
            if (Chance == 1)
              // 當抽到1時，任務失敗
              return (await msg).edit({
                embeds: [
                  bot.say.msgInfo(
                    `\`\`\`md\n- 你尋覓了良久，仍然一無所獲……\n請再次使用指令\`${GuildDB.prefix}quest\`，接取任務。\n\`\`\``
                  )
                ],
                components: []
              })
            const HPBar = Bar(user.屬性['HP'], user.屬性['TotalHP'], 'HP')
            const MPBar = Bar(user.屬性['MP'], user.屬性['TotalMP'], 'MP')

            const Duration = getBetweenRandom(10, 20)
            const text = [
              '# 採集任務執行中……',
              '# 採集任務執行中……\n- 你正在前往目的地的路上。',
              '# 採集任務執行中……\n- 你正在前往目的地的路上。\n- 你發現了一頭野豬，自知不敵，\n便以迅雷不及掩耳之姿逃跑了。\n  1. 敏捷+5\n  2. 經驗值+100',
              '# 採集任務執行中……\n- 你正在前往目的地的路上。\n- 你發現了一頭野豬，自知不敵，\n便以迅雷不及掩耳之姿逃跑了。\n  1. 敏捷+5\n  2. 經驗值+100\n- 你找到了一株散發著異樣氣息的草。',
              '# 採集任務執行中……\n- 你正在前往目的地的路上。\n- 你發現了一頭野豬，自知不敵，\n便以迅雷不及掩耳之姿逃跑了。\n  1. 敏捷+5\n  2. 經驗值+100\n- 你找到了一株散發著異樣氣息的草。\n- 你比對著冒險者公會的圖鑑，發現正是「伊蒂絲藥草」。',
              '# 採集任務執行中……\n- 你正在前往目的地的路上。\n- 你發現了一頭野豬，自知不敵，\n便以迅雷不及掩耳之姿逃跑了。\n  1. 敏捷+5\n  2. 經驗值+100\n- 你找到了一株散發著異樣氣息的草。\n- 你比對著冒險者公會的圖鑑，發現正是「伊蒂絲藥草」。\n- 你開始採集「伊蒂絲藥草」。'
            ]
            for (let i = 1; i < Duration; i++) {
              ;(await msg).edit({
                embeds: [
                  bot.say
                    .msgInfo(
                      `**血量：**\n${HPBar.Bar} \`${
                        HPBar.percentageText
                      }\`\n**魔力值：**\n${MPBar.Bar} \`${
                        MPBar.percentageText
                      }\`\n\`\`\`md\n${text[i - 1] || text[5]}\`\`\``
                    )
                    .setThumbnail(
                      'https://cdn.discordapp.com/attachments/919503944764502057/919504785391120414/unknown.png'
                    )
                    .setFields([
                      {
                        name: '✅ 目標',
                        value: '前往採集一株「伊蒂絲藥草」\n並上繳至冒險者公會',
                        inline: true
                      },
                      {
                        name: '🎁 報酬',
                        value: '新手特惠——\n鐵鎧甲x1, 鐵大劍x1, 背包x1',
                        inline: true
                      },
                      {
                        name: '🕐 耗時',
                        value: '約 10 ~ 20 秒',
                        inline: true
                      },
                      {
                        name: `進度   \`[${
                          QuestBar(i, Duration, 10).percentageText
                        }]\``,
                        value: `\`\`\`\n> | ${
                          QuestBar(i, Duration, 10).Bar
                        }\n\`\`\``
                      }
                    ])
                ],
                components: []
              })
              await wait(1000)
            }
            ;(await msg).edit({
              embeds: [
                bot.say.msgInfo('```md\n# 採集任務完成！```').setFields([
                  {
                    name: '🕐 此次任務耗時',
                    value: `\`\`\`css\n${Duration} 秒\`\`\``,
                    inline: true
                  },
                  {
                    name: '🆙 成長',
                    value: '```md\n[DEX](敏捷)   +5\n[EXP](經驗值) +100\n```'
                  },
                  {
                    name: '🎁 報酬',
                    value: '```md\n+ 鐵鎧甲x1\n+ 鐵大劍x1\n+ 背包x1\n\n```'
                  }
                ])
              ],
              components: []
            })
            // console.log(user.屬性.DEX)
            // user.屬性.DEX += 5
            user.等級 += 1
            // user.裝備 = ['鐵盔甲', '鐵大劍']
            console.log(user.事件紀錄)
            await user.save()
            break
          case 'questFirstRejection': // 婉拒
            ;(await msg).edit({
              embeds: [
                bot.say.msgInfo(
                  `\`\`\`md\n- 若您欲接取任務，請再次輸入指令\`${GuildDB.prefix}quest\`\n\`\`\``
                )
              ],
              components: []
            })
            break
        }
      })
    } else {
    }
  }
}
function QuestBar (value, maxValue, size) {
  const percentage = value / maxValue // Calculate the percentage of the bar
  const progress = Math.round(size * percentage) // Calculate the number of square caracters to fill the progress side.
  const emptyProgress = size - progress // Calculate the number of dash caracters to fill the empty progress side.

  const progressText = '▇'.repeat(progress) // Repeat is creating a string with progress * caracters in it
  const emptyProgressText = '—'.repeat(emptyProgress) // Repeat is creating a string with empty progress * caracters in it
  const percentageText = Math.round(percentage * 100) + '%' // Displaying the percentage of the bar

  const Bar = progressText + emptyProgressText // Creating the bar
  return { Bar, percentageText }
}
