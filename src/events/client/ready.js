require('dotenv').config()

const mongoose = require('mongoose')

module.exports = {
  name: 'ready',
  once: true,
  async execute (bot) {
    //initializing commands
    require('../../handlers/CommandHandler')(bot)

    mongoose
      .connect(bot.config.MongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        bot.logger.log('database', `Connected to the Mongodb database.`)
      })
      .catch(err => {
        bot.logger.error(
          'database',
          `Unable to connect to the Mongodb database. Error:` + err
        )
      })
    bot.logger.log('EVENTS', `Bot: 已上線。`)

    const statuses = {
      name: `CC-RPG`,
      type: 'LISTENING'
    }
    bot.user.setPresence({
      activities: [{ name: statuses.name, type: statuses.type }]
    })
  }
}
