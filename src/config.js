require('dotenv').config()
module.exports = {
  Test: process.env.Test || false, //Whether testing
  Admins: ['806346991730819121'], //Admins of the bot
  DefaultPrefix: process.env.Prefix || '-', //Default prefix, Server Admins can change the prefix
  Token: process.env.Token || '', //Discord Bot Token
  MongoDB: process.env.MONGODB || '', //MongoDB URL
  EmbedColor: 'RANDOM', //Color of most embeds | Dont edit unless you want a specific color instead of a random one each time
  Permissions: 2205281600, //Bot Inviting Permissions
}
