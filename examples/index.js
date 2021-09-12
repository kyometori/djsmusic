const { Client } = require('discord.js');
const { token } = require('./config.json');
const { createMusicManager } = require('../');
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });

client.once('ready', () => {
  console.log('I\'m ready!');
  createMusicManager(client, Infinity);

  client.music.on('join', guild => {
    console.log(`Joined voice channel of server ${guild.name}`);
  });
});

client.on('messageCreate', message => {
  if (message.content === '!join') {
    client.music.join({
      channel: message.member.voice.channel
    }).once('leave', guild => {
      console.log('Leave ' + guild.name);
    });
  }

  if (message.content.startsWith('!play')) {
    client.music.get(message.guild.id).play(message.content.slice(6)).then(track => {
      track.once('end', () => {
        message.channel.send('Next');
      })
    });
  }

  if (message.content === '!pause') {
    client.music.get(message.guild.id).pause();
  }

  if (message.content === '!resume') {
    client.music.get(message.guild.id).resume();
  }

  if (message.content === '!skip') {
    client.music.get(message.guild.id).skip();
  }

  if (message.content === '!leave') {
    client.music.leave(message.guild.id);
  }

  if (message.content === '!check') {
    console.log(client.music);
  }
  if (message.content === '!check guild') {
    console.log(client.music.get(message.guild.id));
  }
});

client.login(token);
