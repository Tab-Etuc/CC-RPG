const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const Users = require('../models/mongoDB/Users.js')

module.exports = {
  name: 'start',
  description: '開始遊玩RPG遊戲',
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
    const User = await Users.findOne({
      _id: message.author.id
    })
    if (!User) {
      const msg = message.reply({
        content:
          '**《神意》**\n是一款帶有中世紀色彩的劍與魔法世界。\n諸君將藉由發送訊息以操縱世界中的角色，並尋覓得《神意》。\n\n世界中的角色一旦徹底湮滅，您便可「受肉」重生至下一角色。\n每「受肉」一次，靈魂便會得到昇華，同時獲得「稀有技能」。\n「稀有技能」將使角色變得更加強大，並得以更加迅速地尋覓得《神意》。',
        ephemeral: false,
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId('startAgree')
              .setLabel('同意')
              .setStyle('SUCCESS'),

            new MessageButton()
              .setCustomId('startRefuse')
              .setLabel('拒絕')
              .setStyle('DANGER')
              .setDisabled(true)
          )
        ],
        embeds: [
          new MessageEmbed()
            .setTitle('事前須知')
            .setDescription(
              '您第一次「受肉」的種族一定是「人族」，並得到神的恩賜——\n稀有技能·「數學者」。\n```md\n# 「數學者」將使血量、魔力等具現數字化，並將事件執行的成功機率計算後轉換為實質數字呈現於您眼前。```\n**《神意》**世界中，您將於觸發特定事件後，獲得技能；\n您無須詠唱、結構術式，即可消耗**MP**施法。\n您在重複使用該技能後，其便利性會隨**熟練度**增加而增加。\n\n您可於完成**「神使任務」**後獲得報酬：\n技能、世界權能、屬性加成……。\n\n**「屬性加成」**為神使特權，您將於初次「受肉」時獲得屬性點、每次升級時獲得屬性加成。「屬性」能使您的攻擊力、防禦力、敏捷……得到提昇。'
            )
            .setColor('#58FFB9'),
          new MessageEmbed()
            .setTitle('請確認您是否同意進去《神意》世界')
            .setDescription('點擊下方按鈕，以回覆您的選擇。')
            .setColor('#58FFB9')
        ]
      })
      const filter = i =>
        i.customId === 'startAgree' && i.user.id === message.author.id

      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 15000
      })
      let deleted = false
      collector.on('collect', async i => {
        if (i.customId === 'startAgree') {
          ;(await msg).delete().catch(err => console.log(err))
          deleted = true

          let button = new Array([], [])
          let row = []
          let text = [
            'ATK+',
            'DEF+',
            'INT+',
            'DEX+',
            '重置',
            'ATK-',
            'DEF-',
            'INT-',
            'DEX-',
            '完成'
          ]
          let ATK = 10
          let DEF = 10
          let INT = 100
          let DEX = 100
          let current = 0
          for (let i = 0; i < text.length; i++) {
            if (button[current].length === 5) current++
            button[current].push(createButton(text[i]))

            if (i === text.length - 1) {
              for (let btn of button) row.push(addRow(btn))
            }
          }
          await i.channel
            .send({
              ephemeral: false,
              embeds: [
                bot.say.msgInfo(
                  '```markdown\n# 您現在是第 1 次轉生，您目前是<人族>！\n\n- 您獲得了神的恩賜——\n  1. 稀有技能「數學者」\n  2. 屬性點數  10  點\n```\n```md\n#屬性面板\n- ATK(Attack)：物理攻擊力 10\n- DEF(Defense)：防禦力 10\n- INT(Intelligence)：智力 100\n- DEX(Dexterity)：敏捷 100\n```\n**請點擊下方按鈕，增加或減少屬性點！**\n您目前有 ** 10 ** 屬性點！'
                )
              ],
              components: row
            })
            .then(async Amsg => {
              let time = 300000
              let totalAtt = 10
              let emb1 = new MessageEmbed()
                .setTitle('<:gura:916521356370251796> 《神意》資訊面板')
                .setColor(16772493)
                .setTimestamp()
                .setImage('https://imgur.com/ARAAYlh.gif')

              function createCollector (val, result = false) {
                const filter = button =>
                  button.user.id === message.author.id &&
                  button.customId === 'Att' + val
                let collect = Amsg.createMessageComponentCollector({
                  filter,
                  componentType: 'BUTTON',
                  time: time
                })
                collect.on('collect', async x => {
                  if (x.user.id !== message.author.id) return

                  x.deferUpdate()
                  // 重置
                  if (result === 'new') {
                    ATK = 10
                    DEF = 10
                    INT = 100
                    DEX = 100
                    totalAtt = 10
                  } // 完成
                  else if (result) {
                    await Amsg.delete().catch(err => console.log(err))
                    await i.channel.send({
                      embeds: [
                        bot.say.msgInfo(
                          `\`\`\`md\n# 屬性加點成功！\`\`\`\n您可以輸入\`${GuildDB.prefix}join\`選擇欲加入的陣營（冒險者公會、帝國）！`
                        )
                      ],
                      components: []
                    })
                    let data = {}
                    data['ATK'] = ATK
                    data['DEF'] = DEF
                    data['INT'] = INT
                    data['DEX'] = DEX
                    new Users({
                      _id: message.author.id,
                      區域: '初始之地——新手鎮',
                      種族: '人族',
                      技能: ['數學者'],
                      屬性: data,
                      創建於: Date.now()
                    }).save()
                  } else if (val.includes('ATK+')) {
                    if (totalAtt != 0) {
                      ATK += 1
                      totalAtt -= 1
                    }
                  } else if (val.includes('DEF+')) {
                    if (totalAtt != 0) {
                      DEF += 1
                      totalAtt -= 1
                    }
                  } else if (val.includes('INT+')) {
                    if (totalAtt != 0) {
                      INT += 1
                      totalAtt -= 1
                    }
                  } else if (val.includes('DEX+')) {
                    if (totalAtt != 0) {
                      DEX += 1
                      totalAtt -= 1
                    }
                  } else if (val.includes('ATK-')) {
                    if (ATK > 10) {
                      ATK -= 1
                      totalAtt += 1
                    }
                  } else if (val.includes('DEF-')) {
                    if (DEF > 10) {
                      DEF -= 1
                      totalAtt += 1
                    }
                  } else if (val.includes('INT-')) {
                    if (INT > 100) {
                      INT -= 1
                      totalAtt += 1
                    }
                  } else if (val.includes('DEX-')) {
                    if (DEX > 100) {
                      DEX -= 1
                      totalAtt += 1
                    }
                  }

                  emb1.setDescription(
                    `\`\`\`markdown\n# 您現在是第 1 次轉生，您目前是<人族>！\n\n- 您獲得了神的恩賜——\n  1. 稀有技能「數學者」\n  2. 屬性點數  10  點\n\`\`\`\n\`\`\`md\n#屬性面板\n- ATK(Attack)：物理攻擊力 ${ATK}\n- DEF(Defense)：防禦力 ${DEF}\n- INT(Intelligence)：智力 ${INT}\n- DEX(Dexterity)：敏捷 ${DEX}\n\`\`\`\n**請點擊下方按鈕，增加或減少屬性點！**\n您目前有 ** ${totalAtt} ** 屬性點！`
                  )
                  try {
                    await Amsg.edit({
                      embeds: [emb1],
                      components: row
                    })
                  } catch (e) {
                    return
                  }
                })
              }
              for (let txt of text) {
                let result

                if (txt === '重置') result = 'new'
                else if (txt === '完成') result = true
                else result = false
                createCollector(txt, result)
              }
              setTimeout(async () => {
                if (!deleted) {
                  await Amsg.edit({
                    embeds: [
                      bot.say.msgInfo(
                        `\`\`\`markdown\n- 已逾時！\`\`\`\n**請嘗試再次輸入\`${GuildDB.prefix}start\``
                      )
                    ],
                    embedscomponents: []
                  })
                }
              }, time)
            })
        }
      })

      collector.on('end', async collected => {
        if (!deleted) (await msg).delete().catch(err => console.log(err))
      })
    } else {
      message.channel.send({
        embeds: [
          bot.say.msgInfo(
            `您早已於<t:${Math.floor(User.創建於 / 1000)}:F>啟程了。`
          )
        ]
      })
    }
  }
}

function addRow (btns) {
  let row1 = new MessageActionRow()
  for (let btn of btns) {
    row1.addComponents(btn)
  }
  return row1
}
function createButton (label, style = 'SECONDARY') {
  let Dis = false
  if (label.endsWith('+')) style = 'SUCCESS'
  else if (label.endsWith('-')) style = 'DANGER'
  else if (label === '完成') style = 'PRIMARY'
  else if (label === '重置') style = 'PRIMARY'
  else {
    style = 'SECONDARY'
    Dis = true
  }
  const btn = new MessageButton()
    .setLabel(label)
    .setStyle(style)
    .setCustomId('Att' + label)
    .setDisabled(Dis)
  return btn
}
