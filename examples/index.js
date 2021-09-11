const { Client } = require('discord.js');
const { token } = require('./config.json');
const { createMusicManager } = require('../');
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });

client.once('ready', () => {
  console.log('I\'m ready!');
  createMusicManager(client);
})

client.on('messageCreate', message => {
  if (message.content === '!join') {
    client.music.join({
      channel: message.member.voice.channel
    });
  }

  if (message.content === '!leave') {
    client.music.leave(message.guild.id);
  }

  if (message.content === '!check') {
    console.log(client.music);
  }
});

client.login(token);
