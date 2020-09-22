const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const command = require('./command')

client.on('ready', () => {
  console.log("The client is ready!")


  command(client, 'ping', (message) => {
    message.channel.send('Pong!')
  })

  command(client, 'servers', (message) => {
    client.guilds.cache.forEach((guild) => {
      message.channel.send(`**${guild.name}** has a total of **${guild.memberCount}** members.`)
    })
  })

  command(client, ['cc', 'clearchannel'], (message) => {
    if (message.member.roles.cache.find(r => r.name === "Moderator") || message.member.roles.cache.find(r => r.name === "Owner")) {
      message.channel.messages.fetch().then(results => {
        message.channel.bulkDelete(results)
          .then(messages => console.log(`Bulk deleted ${messages.size} messages.`))
      })
    } else {
      message.channel.send(`<@${message.author.id}> You do not have the permissions for this command.`)
        .then(console.log(`Command ${message} failed. User did not have permissions.`))
        .catch(error => console.log(error))
    }
  })

  command(client, 'status', (message) => {
    if (message.member.roles.cache.find(r => r.name === "Owner")) {
      const content = message.content.replace('$status ', '')

      client.user.setPresence({
        activity: {
          name: content,
          type: 0,
        }
      })
        .then(console.log(`Bot status set to ${content}.`))
        .catch(error => console.log(error))
    } else {
      console.log(`Command ${message} failed. User did not have permissions.`)
    }
  })
})

client.login(config.token)
