/**
 * This is an easy example of how to use this package
 */
const { Client } = require('discord.js');
const { token } = require('./config.json');
const { createMusicManager, YoutubeUtils } = require('../');
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });

client.once('ready', () => {
  console.log('I\'m ready!');

  // Create the music manager with inline volume enable
  createMusicManager(client, {
    enableInlineVolume: true,
  });
});

client.on('messageCreate', message => {
  // Command join
  if (message.content === '!join') {
    // join the channel
    client.music
      .join({ channel: message.member.voice.channel })
      .then(manager => {

        // when a song is finished, send the text
        manager.on('end', next => {
          if (!next) message.channel.send('Finished!');
          else message.channel.send('Next!');
        })
      });

    message.reply('Joined ' + message.member.voice.channel.name);
  }

  // Command play
  if (message.content.startsWith('!play')) {
    client.music
      // Get the GuildMusicManager
      .get(message.guild.id)
      // play the resouce, remember to specify player
      .play(message.content.slice(6), {
        player: message.member,
        details: {
          note: 'Playing by using @kyometori/djsmusic!'
        }
      })
      // this return a promise
      // track is the track
      // queued is a Boolean, means if this track queued or play directly
      .then(([track, queued]) => {
        // if its queued or not
        if (queued) message.reply('Queued the song!');
        else message.reply('Playing now!');
      });
  }

  // Command seek
  if (message.content.startsWith('!seek')) {
    // Just use seek function!
    // We make it so simple
    client.music.get(message.guild.id).seek(+message.content.slice(6));
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

  // Command loop
  if (message.content === '!loop') {
    // toggle loop
    const manager = client.music.get(message.guild.id);
    manager.setLoop(!manager.nowPlaying.isLooping);
    message.reply('Toggle loop!');
  }

  // Volume Control
  if (message.content === '!v+') {
    const manager = client.music.get(message.guild.id);
    manager.setVolume(manager.getVolume() + 0.1);
  }

  if (message.content === '!v-') {
    const manager = client.music.get(message.guild.id);
    manager.setVolume(manager.getVolume() - 0.1);
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
