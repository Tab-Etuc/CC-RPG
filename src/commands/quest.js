const { MessageButton, MessageActionRow } = require('discord.js'),
  Users = require('../models/mongoDB/Users.js'),
  Bar = require('../models/Bar'),
  { getRandom, getBetweenRandom } = require('../models/Math'),
  wait = require('util').promisify(setTimeout),
  Data = require('../assets/Data/quest.js'),
  CheckLevelUp = require('../models/CheckLevelUp'),
  Items = require('../assets/Data/items')
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
    // 初始事件
    if (user.事件紀錄.完成任務數.總共 == 0) {
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
                .setCustomId('questFirstAgree' + message.id)
                .setLabel('同意')
                .setStyle('SUCCESS'),
              new MessageButton()
                .setCustomId('questFirstRejection' + message.id)
                .setLabel('取消')
                .setStyle('DANGER')
            )
          ]
        }),
        filter = i =>
          (i.customId === 'questFirstAgree' + message.id ||
            i.customId === 'questFirstRejection' + message.id) &&
          i.user.id === message.author.id,
        collector = message.channel.createMessageComponentCollector({
          filter,
          time: 60000
        })

      collector.on('collect', async i => {
        const HPBar = Bar(user.HP, user.THP, 'HP'),
          MPBar = Bar(user.MP, user.TMP, 'MP')
        switch (i.customId) {
          case 'questFirstAgree' + message.id: // 同意
            let Chance = getRandom(9) // 隨機亂數1~10
            if (Chance == 1) {
              // 當抽到1時，任務失敗
              ;(await msg).edit({
                embeds: [
                  bot.say.msgInfo(
                    `\`\`\`md\n- 你尋覓了良久，仍然一無所獲……\n請再次使用指令\`${GuildDB.prefix}quest\`，接取任務。\n\`\`\``
                  )
                ],
                components: []
              })
              break
            }

            const Duration = getBetweenRandom(10, 20),
              text = [
                '# 採集任務執行中……',
                '# 採集任務執行中……\n- 你正在前往目的地的路上。',
                '# 採集任務執行中……\n- 你正在前往目的地的路上。\n- 你發現了一頭野豬，自知不敵，\n便以迅雷不及掩耳之姿逃跑了。\n  1. 敏捷+5',
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
                      }\`\n\`\`\`md\n${text[i - 1] || text[6]}\`\`\``
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
                    value: '```css\n+ 鐵鎧甲x1\n+ 鐵大劍x1\n+ 背包x1\n\n```'
                  }
                ])
              ],
              components: []
            })

            await Users.updateOne(
              { _id: message.author.id },
              {
                '屬性.DEX': user.屬性.DEX + 5,
                經驗值: user.經驗值 + 100,
                裝備: ['鐵盔甲', '鐵大劍'],
                '事件紀錄.完成任務數.總共': user.事件紀錄.完成任務數.總共 + 1
              }
            ).catch(err => console.log(err))
            await CheckLevelUp(bot, message)
            break
          case 'questFirstRejection' + message.id: // 取消
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
      const Fields = [],
        Flength = Object.keys(Data[user.評級][0].訊息).length,
        短暫任務 = Data[user.評級][0].訊息[getBetweenRandom(1, Flength)],
        Slength = Object.keys(Data[user.評級][1].訊息).length,
        中等任務 = Data[user.評級][1].訊息[getBetweenRandom(1, Slength)],
        Tlength = Object.keys(Data[user.評級][2].訊息).length,
        持久任務 = Data[user.評級][2].訊息[getBetweenRandom(1, Tlength)]

      Fields.push(短暫任務.Fields)
      Fields.push(中等任務.Fields)
      Fields.push(持久任務.Fields)

      const msg = message.channel.send({
          embeds: [
            bot.say
              .msgInfo(
                `\`\`\`md\n# 請選擇欲執行的任務\n\n* 註：獲得之經驗值會隨著耗時增加而增加\n\`\`\``
              )
              .setFields(Fields)
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId('questFirst' + message.id)
                .setLabel(短暫任務.Fields.name)
                .setStyle('SUCCESS'),
              new MessageButton()
                .setCustomId('questSecond' + message.id)
                .setLabel(中等任務.Fields.name)
                .setStyle('SUCCESS'),
              new MessageButton()
                .setCustomId('questThird' + message.id)
                .setLabel(持久任務.Fields.name)
                .setStyle('SUCCESS'),
              new MessageButton()
                .setCustomId('questRejection' + message.id)
                .setLabel('取消')
                .setStyle('DANGER')
            )
          ]
        }),
        filter = i =>
          (i.customId === 'questFirst' + message.id ||
            i.customId === 'questSecond' + message.id ||
            i.customId === 'questThird' + message.id ||
            i.customId === 'questRejection' + message.id) &&
          i.user.id === message.author.id,
        collector = message.channel.createMessageComponentCollector({
          filter,
          time: 60000
        })

      collector.on('collect', async i => {
        const HPBar = Bar(user.HP, user.THP, 'HP'),
          MPBar = Bar(user.MP, user.TMP, 'MP'),
          item = Items.find(x => x.name === '銅')

        switch (i.customId) {
          case 'questFirst' + message.id:
            if (短暫任務.Fields.name == '採集') {
              const Chance = getRandom(9) // 隨機亂數1~10
              if (Chance == 1) {
                // 當抽到1時，任務失敗
                ;(await msg).edit({
                  embeds: [
                    bot.say
                      .msgInfo(
                        `\`\`\`md\n- 你尋覓了良久，仍然一無所獲……\n請再次使用指令\`${GuildDB.prefix}quest\`，接取任務。\n\`\`\``
                      )
                      .setFields([])
                  ],
                  components: []
                })
                break
              }
            }

            const Duration = getBetweenRandom(10, 20),
              text = 短暫任務.Text
            for (let i = 1; i < Duration; i++) {
              ;(await msg).edit({
                embeds: [
                  bot.say
                    .msgInfo(
                      `**血量：**\n${HPBar.Bar} \`${
                        HPBar.percentageText
                      }\`\n**魔力值：**\n${MPBar.Bar} \`${
                        MPBar.percentageText
                      }\`\n\`\`\`md\n${text[i - 1] || text[0]}\`\`\``
                    )
                    .setThumbnail(短暫任務.Thumbnail)
                    .setFields([
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
            let expFormulas = Math.floor(Duration ** 1.1 * user.等級 ** 1.4)
            const expToAdd = getBetweenRandom(
              Math.floor(expFormulas * 0.8),
              expFormulas
            )
            ;(await msg).edit({
              embeds: [
                bot.say
                  .msgInfo(
                    `\`\`\`md\n# ${短暫任務.Fields.name}任務完成！\`\`\``
                  )
                  .setFields([
                    {
                      name: '🕐 此次任務耗時',
                      value: `\`\`\`css\n${Duration} 秒\`\`\``,
                      inline: true
                    },
                    {
                      name: '🆙 成長',
                      value: `\`\`\`md\n[EXP](經驗值) +${expToAdd}\n\`\`\``
                    },
                    {
                      name: '🎁 報酬',
                      value: `\`\`\`css\n1 銅\n\`\`\``
                    }
                  ])
              ],
              components: []
            })

            let founditem = user.背包.find(x => x.name === item.name),
              array = []
            array = user.背包.filter(x => x.name !== item.name)
            if (founditem) {
              array.push({
                name: item.name,
                amount: parseInt(founditem.amount) + 1,
                description: item.description
              })
              user.背包 = array
            } else {
              user.背包.push({
                name: item.name,
                amount: 1,
                description: item.description
              })
            }
            await Users.updateOne(
              { _id: message.author.id },
              {
                經驗值: user.經驗值 + expToAdd,
                '事件紀錄.完成任務數.總共': user.事件紀錄.完成任務數.總共 + 1,
                背包: user.背包
              }
            ).catch(err => console.log(err))
            CheckLevelUp(bot, message)
            break
          case 'questSecond' + message.id:
            if (中等任務.Fields.name == '採集') {
              const Chance = getRandom(9) // 隨機亂數1~10
              if (Chance == 1) {
                // 當抽到1時，任務失敗
                ;(await msg).edit({
                  embeds: [
                    bot.say
                      .msgInfo(
                        `\`\`\`md\n- 你尋覓了良久，仍然一無所獲……\n請再次使用指令\`${GuildDB.prefix}quest\`，接取任務。\n\`\`\``
                      )
                      .setFields([])
                  ],
                  components: []
                })
                break
              }
            }

            const questSecondDuration = getBetweenRandom(10, 20),
              questSecondText = 中等任務.Text
            for (let i = 1; i < questSecondDuration; i++) {
              ;(await msg).edit({
                embeds: [
                  bot.say
                    .msgInfo(
                      `**血量：**\n${HPBar.Bar} \`${
                        HPBar.percentageText
                      }\`\n**魔力值：**\n${MPBar.Bar} \`${
                        MPBar.percentageText
                      }\`\n\`\`\`md\n${questSecondText[i - 1] ||
                        questSecondText[0]}\`\`\``
                    )
                    .setThumbnail(中等任務.Thumbnail)
                    .setFields([
                      {
                        name: `進度   \`[${
                          QuestBar(i, questSecondDuration, 10).percentageText
                        }]\``,
                        value: `\`\`\`\n> | ${
                          QuestBar(i, questSecondDuration, 10).Bar
                        }\n\`\`\``
                      }
                    ])
                ],
                components: []
              })
              await wait(1000)
            }
            let questSecondExpFormulas = Math.floor(
              questSecondDuration ** 1.1 * user.等級 ** 1.4
            )
            const questSecondExpToAdd = getBetweenRandom(
              Math.floor(questSecondExpFormulas * 0.8),
              questSecondExpFormulas
            )
            ;(await msg).edit({
              embeds: [
                bot.say
                  .msgInfo(
                    `\`\`\`md\n# ${中等任務.Fields.name}任務完成！\`\`\``
                  )
                  .setFields([
                    {
                      name: '🕐 此次任務耗時',
                      value: `\`\`\`css\n${questSecondDuration} 秒\`\`\``,
                      inline: true
                    },
                    {
                      name: '🆙 成長',
                      value: `\`\`\`md\n[EXP](經驗值) +${questSecondExpToAdd}\n\`\`\``
                    },
                    {
                      name: '🎁 報酬',
                      value: `\`\`\`css\n1 銅\n\`\`\``
                    }
                  ])
              ],
              components: []
            })

            let questSecondFoundItem = user.背包.find(
                x => x.name === item.name
              ),
              questSecondBag = []
            questSecondBag = user.背包.filter(x => x.name !== item.name)
            if (questSecondFoundItem) {
              questSecondBag.push({
                name: item.name,
                amount: parseInt(questSecondFoundItem.amount) + 1,
                description: item.description
              })
              user.背包 = questSecondBag
            } else {
              user.背包.push({
                name: item.name,
                amount: 1,
                description: item.description
              })
            }
            await Users.updateOne(
              { _id: message.author.id },
              {
                經驗值: user.經驗值 + questSecondExpToAdd,
                '事件紀錄.完成任務數.總共': user.事件紀錄.完成任務數.總共 + 1,
                背包: user.背包
              }
            ).catch(err => console.log(err))
            CheckLevelUp(bot, message)
            break
          case 'questThird' + message.id:
            if (持久任務.Fields.name == '採集') {
              const Chance = getRandom(9) // 隨機亂數1~10
              if (Chance == 1) {
                // 當抽到1時，任務失敗
                ;(await msg).edit({
                  embeds: [
                    bot.say
                      .msgInfo(
                        `\`\`\`md\n- 你尋覓了良久，仍然一無所獲……\n請再次使用指令\`${GuildDB.prefix}quest\`，接取任務。\n\`\`\``
                      )
                      .setFields([])
                  ],
                  components: []
                })
                break
              }
            }

            const questThirdDuration = getBetweenRandom(10, 20),
              questThirdText = 持久任務.Text
            for (let i = 1; i < questThirdDuration; i++) {
              ;(await msg).edit({
                embeds: [
                  bot.say
                    .msgInfo(
                      `**血量：**\n${HPBar.Bar} \`${
                        HPBar.percentageText
                      }\`\n**魔力值：**\n${MPBar.Bar} \`${
                        MPBar.percentageText
                      }\`\n\`\`\`md\n${questThirdText[i - 1] ||
                        questThirdText[0]}\`\`\``
                    )
                    .setThumbnail(持久任務.Thumbnail)
                    .setFields([
                      {
                        name: `進度   \`[${
                          QuestBar(i, questThirdDuration, 10).percentageText
                        }]\``,
                        value: `\`\`\`\n> | ${
                          QuestBar(i, questThirdDuration, 10).Bar
                        }\n\`\`\``
                      }
                    ])
                ],
                components: []
              })
              await wait(1000)
            }
            let questThirdExpFormulas = Math.floor(
              questThirdDuration ** 1.1 * user.等級 ** 1.4
            )
            const questThirdExpToAdd = getBetweenRandom(
              Math.floor(questThirdExpFormulas * 0.8),
              questThirdExpFormulas
            )
            ;(await msg).edit({
              embeds: [
                bot.say
                  .msgInfo(
                    `\`\`\`md\n# ${持久任務.Fields.name}任務完成！\`\`\``
                  )
                  .setFields([
                    {
                      name: '🕐 此次任務耗時',
                      value: `\`\`\`css\n${questThirdDuration} 秒\`\`\``,
                      inline: true
                    },
                    {
                      name: '🆙 成長',
                      value: `\`\`\`md\n[EXP](經驗值) +${questThirdExpToAdd}\n\`\`\``
                    },
                    {
                      name: '🎁 報酬',
                      value: `\`\`\`css\n1 銅\n\`\`\``
                    }
                  ])
              ],
              components: []
            })

            let questThirdFoundItem = user.背包.find(x => x.name === item.name),
              questThirdBag = []
            questThirdBag = user.背包.filter(x => x.name !== item.name)
            if (questThirdFoundItem) {
              questThirdBag.push({
                name: item.name,
                amount: parseInt(questThirdFoundItem.amount) + 1,
                description: item.description
              })
              user.背包 = questThirdBag
            } else {
              user.背包.push({
                name: item.name,
                amount: 1,
                description: item.description
              })
            }
            await Users.updateOne(
              { _id: message.author.id },
              {
                經驗值: user.經驗值 + questThirdExpToAdd,
                '事件紀錄.完成任務數.總共': user.事件紀錄.完成任務數.總共 + 1,
                背包: user.背包
              }
            ).catch(err => console.log(err))
            CheckLevelUp(bot, message)
            break
          case 'questRejection' + message.id: // 取消
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
    }
  }
}
function QuestBar (value, maxValue, size) {
  const percentage = value / maxValue, // Calculate the percentage of the bar
    progress = Math.round(size * percentage), // Calculate the number of square caracters to fill the progress side.
    emptyProgress = size - progress, // Calculate the number of dash caracters to fill the empty progress side.
    progressText = '▇'.repeat(progress), // Repeat is creating a string with progress * caracters in it
    emptyProgressText = '—'.repeat(emptyProgress), // Repeat is creating a string with empty progress * caracters in it
    percentageText = Math.round(percentage * 100) + '%', // Displaying the percentage of the bar
    Bar = progressText + emptyProgressText // Creating the bar
  return { Bar, percentageText }
}
