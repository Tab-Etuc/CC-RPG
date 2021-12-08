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
      const msg = message.channel.send({
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
              '您第一次「受肉」的種族一定是「人族」，並得到神的恩賜——\n稀有技能·「數學者」。\n「數學者」將使血量、魔力等具現數字化，並將事件執行的成功機率計算後轉換為實質數字呈現於您眼前。\n\n《神意》世界中，人界分為兩大勢力：'
            )
            .setColor('#58FFB9')
            .setFields([
              {
                name: '自由的象徵——冒險者公會',
                value:
                  '加入冒險者公會後可接受公會張貼之任務以獲取報酬，並從中學習。\n冒險者可於各地設有冒險者分部的國家間自由行動，並且能獲得特別優待。\n當對自己實力有一定自信後，可參加冒險者公會主辦的考核，並能獲取接更高難度的任務權限。'
              },
              {
                name: '絕對的強權——阿斯克特帝國',
                value:
                  '若您於阿斯克特帝國從軍，將執行皇帝的旨意，並不得有絲毫忤逆之心。\n您可於此獲得與軍職相稱的裝備、武器、必需品。'
              }
            ]),
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
      let a = true
      collector.on('collect', async i => {
        if (i.customId === 'startAgree') {
          ;(await msg).delete()
          a = false

          let button = new Array([], [], [], [])
          let row = []
          let text = [
            'ATK+',
            'DEF+',
            'HP+',
            '神',
            'INT+',
            'MP+',
            'DEX+',
            '諭',
            'ATK-',
            'DEF-',
            'HP-',
            '重置',
            'INT-',
            'MP-',
            'DEX-',
            '完成'
          ]
          let ATK = 10
          let DEF = 1
          let HP = 100
          let INT = 100
          let MP = 100
          let DEX = 100
          let current = 0
          for (let i = 0; i < text.length; i++) {
            if (button[current].length === 4) current++
            button[current].push(createButton(text[i]))

            if (i === text.length - 1) {
              for (let btn of button) row.push(addRow(btn))
            }
          }
          const embed = new MessageEmbed()
            .setTitle('<:gura:916521356370251796> 《神意》資訊面板')
            .setDescription(
              '```markdown\n# 您現在是第 1 次轉生，您目前是<人族>！\n\n- 您獲得了神的恩賜——\n  1. 稀有技能「數學者」\n  2. 屬性點數  30  點\n```\n```md\n#屬性面板\n- ATK(Attack)：物理攻擊力 10\n- DEF(Defense)：防禦力 1\n- HP(Health Point)：血量 100\n- INT(Intelligence)：智力 100\n- MP(Magic point)：魔力值 100\n- DEX(Dexterity)：敏捷 100\n```\n**請點擊下方按鈕，增加或減少屬性點！**\n您目前有 ** 30 ** 屬性點！'
            )
            .setColor(16772493)
            .setTimestamp()
            .setImage('https://imgur.com/ARAAYlh.gif')

          await i.channel
            .send({
              ephemeral: false,
              embeds: [embed],
              components: row
            })
            .then(async Amsg => {
              let time = 300000
              let totalAtt = 30
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
                    DEF = 1
                    HP = 100
                    INT = 100
                    MP = 100
                    DEX = 100
                    totalAtt = 30
                  } // 完成
                  else if (result) {
                    const embed = new MessageEmbed()
                      .setTitle('<:gura:916521356370251796> 《神意》資訊面板')
                      .setDescription(
                        '```md\n# 屬性加點成功！```\n您可以輸入`Cjoin`選擇欲加入的陣營（冒險者公會、帝國）！'
                      )
                      .setColor(16772493)
                      .setTimestamp()
                      .setImage('https://imgur.com/ARAAYlh.gif')
                    await Amsg.delete()
                    await i.channel.send({
                      embeds: [embed],
                      components: []
                    })
                    let data = {}
                    data['ATK'] = ATK
                    data['DEF'] = DEF
                    data['HP'] = HP
                    data['INT'] = INT
                    data['MP'] = MP
                    data['DEX'] = DEX
                    new Users({
                      _id: message.author.id,
                      區域: '初始之地——新手鎮',
                      種族: '人族',
                      技能: ['數學者'],
                      屬性: data,
                      升等增加之屬性: {
                        ATK: 3,
                        DEF: 3,
                        HP: 5,
                        INT: 3,
                        MP: 6,
                        DEX: 2
                      },
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
                  } else if (val.includes('HP+')) {
                    if (totalAtt != 0) {
                      HP += 1
                      totalAtt -= 1
                    }
                  } else if (val.includes('INT+')) {
                    if (totalAtt != 0) {
                      INT += 1
                      totalAtt -= 1
                    }
                  } else if (val.includes('MP+')) {
                    if (totalAtt != 0) {
                      MP += 1
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
                  } else if (val.includes('HP-')) {
                    if (HP > 100) {
                      HP -= 1
                      totalAtt += 1
                    }
                  } else if (val.includes('INT-')) {
                    if (INT > 100) {
                      INT -= 1
                      totalAtt += 1
                    }
                  } else if (val.includes('MP-')) {
                    if (MP > 100) {
                      MP -= 1
                      totalAtt += 1
                    }
                  } else if (val.includes('DEX-')) {
                    if (DEX > 100) {
                      DEX -= 1
                      totalAtt += 1
                    }
                  }

                  emb1.setDescription(
                    `\`\`\`markdown\n# 您現在是第 1 次轉生，您目前是<人族>！\n\n- 您獲得了神的恩賜——\n  1. 稀有技能「數學者」\n  2. 屬性點數  30  點\n\`\`\`\n\`\`\`md\n#屬性面板\n- ATK(Attack)：物理攻擊力 ${ATK}\n- DEF(Defense)：防禦力 ${DEF}\n- HP(Health Point)：血量 ${HP}\n- INT(Intelligence)：智力 ${INT}\n- MP(Magic point)：魔力值 ${MP}\n- DEX(Dexterity)：敏捷 ${DEX}\n\`\`\`\n**請點擊下方按鈕，增加或減少屬性點！**\n您目前有 ** ${totalAtt} ** 屬性點！`
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
                await Amsg.edit({
                  embeds: [
                    new MessageEmbed()
                      .setTitle('<:gura:916521356370251796> 《神意》資訊面板')
                      .setColor(16772493)
                      .setTimestamp()
                      .setImage('https://imgur.com/ARAAYlh.gif')
                      .setDescription(
                        `\`\`\`markdown\n- 已逾時！\`\`\`\n**請嘗試再次輸入\`Cstart\``
                      )
                  ],
                  embedscomponents: []
                })
              }, time)
            })
        }
      })

      collector.on('end', async collected => {
        if (a) (await msg).delete()
      })
    } else {
      message.channel.send({
        embeds: [
          new MessageEmbed().setDescription(
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
