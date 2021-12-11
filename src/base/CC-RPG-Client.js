const { Client, Collection } = require('discord.js')
const prettyMilliseconds = require('pretty-ms')

require('../models/format')
require('dotenv').config()

// Creates CC-RPG-bot class
class CCRPG extends Client {
  constructor (
    props = {
      intents: 32767,
      fetchAllMembers: true,
      allowedMentions: {
        parse: ['users']
      }
    }
  ) {
    super(props)

    this.commands = new Collection()
    this.logger = require('./Logger')
    this.utils = require('../models/Functions')
    this.say = require('../models/Embeds')
    this.config = require('../config')
    this.ms = prettyMilliseconds
    this.build()
  }

  build () {
    this.login(this.config.Token)
    require('../handlers/EventHandler')(this)
  }
}

module.exports = CCRPG
