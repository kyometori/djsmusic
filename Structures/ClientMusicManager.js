const EventEmitter = require('events');
const GuildMusicManager = require('./GuildMusicManager.js');
const { joinVoiceChannel } = require('@discordjs/voice');

class ClientMusicManager extends EventEmmiter {
  constructor(client) {
    if (!client) throw new Error('MISSING_CLIENT');
    this.client = client;

    this._data = new Map();
  }

  has(id) {
    return this._data.has(id);
  }

  get(id) {
    if (this._data.has(id)) return this._data.get(id);
    return undefined;
  }

  join(channel, {
    setMute = false,
    setDeaf = false
  }) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: setDeaf,
      selfMute: setMute
    });

    this._data.set(channel.guild.id, new GuildMusicManager());
  }

  leave(id) {
    this._data.get(id).leave();
  }
}

module.exports = ClientMusicManager;
