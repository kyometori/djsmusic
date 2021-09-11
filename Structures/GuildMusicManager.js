const EventEmitter = require('events');
const { createAudioPlayer, getVoiceConnection } = require('@discordjs/voice');

class GuildMusicManager extends EventEmitter {
  constructor({ client, manager, channel, maxQueueSize }) {
    super();
    this.client = client;
    this.guild = channel.guild;
    this.channel = channel;
    this.manager = manager;
    this.voiceState = channel.guild.me.voice;
    this.player = createAudioPlayer();
    this.queue = [];
    this.MAX_QUEUE_SIZE = maxQueueSize ?? 99;
    this.isPlaying = false;
    this.nowPlaying = {};
  }

  play(url) {

  }

  leave() {
    getVoiceConnection(this.guild.id).destroy();
    this.manager._data.delete(this.guild.id);
  }
}

module.exports = GuildMusicManager;
