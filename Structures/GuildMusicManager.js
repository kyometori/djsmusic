const EventEmitter = require('events');
const { createAudioPlayer, getVoiceConnection } = require('@discordjs/voice');

class GuildMusicManager extends EventEmiter {
  constructor({ client, channel, maxQueueSize }) {
    super();
    this.client = client;
    this.guild = channel.guild;
    this.channel = channel;
    this.voiceState = channel.guild.me.voiceState;
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
  }
}

module.exports = GuildMusicManager;
