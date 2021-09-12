/**
 * This is an easy example of how to use this package
 */
const { Client } = require('discord.js');
const { token } = require('./config.json');
const { createMusicManager } = require('../');
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });

client.once('ready', () => {
  console.log('I\'m ready!');

  // Create the music manager with default options
  createMusicManager(client);
});

client.on('messageCreate', message => {
  // Command join
  if (message.content === '!join') {
    // join the channel
    client.music.join({
      channel: message.member.voice.channel
    });

    message.reply('Joined ' + message.member.voice.channel.name);
  }

  // Command play
  if (message.content.startsWith('!play')) {
    client.music
      // Get the GuildMusicManager
      .get(message.guild.id)
      // play the resouce, remember to specify player
      .play(message.content.slice(6), {player: message.member})
      // this return a promise
      // track is the track
      // queued is a Boolean, means if this track queued or play directly
      .then(([track, queued]) => {
        // if its queued or not
        if (queued) message.reply('Queued the song!');
        else message.reply('Playing now!');
        // when the track end
        track.once('end', function () {
          if (!this.manager.hasNext()) return message.channel.send('Finish')
          message.channel.send('Next');
        });
    });
  }

  // Command pause
  if (message.content === '!pause') {
    // pause it
    client.music.get(message.guild.id).pause();
  }

  // Command resume
  if (message.content === '!resume') {
    // unpause it
    client.music.get(message.guild.id).resume();
  }

  // Command skip
  if (message.content === '!skip') {
    // skip it
    client.music.get(message.guild.id).skip();
  }

  // Command leave
  if (message.content === '!leave') {
    // leave with ClientMusicManager
    // alternatively you can do this:
    //   client.music.get(message.guild.id).leave();
    client.music.leave(message.guild.id);
  }
});

client.login(token);
