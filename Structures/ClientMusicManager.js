const EventEmitter = require('events');
const GuildMusicManager = require('./GuildMusicManager.js');
const { joinVoiceChannel,
        entersState,
        VoiceConnectionStatus } = require('@discordjs/voice');

class ClientMusicManager extends EventEmitter {
  constructor(client) {
    if (!client) throw new Error('MISSING_CLIENT');
    super();
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

  join({ channel, setMute, setDeaf }) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: setDeaf,
      selfMute: setMute
    });

    this._data.set(channel.guild.id, new GuildMusicManager({
      client: this.client,
      manager: this,
      channel: channel
    }));

    // 讓 connection 綁定 player
    const dj = this._data.get(channel.guild.id);
    connection.subscribe(dj.player);

    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
      // 如果
      try {
        // 在一秒內重新連線的話，表示是從一語音頻道移動至另一個，便不做事
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 1e3),
          entersState(connection, VoiceConnectionStatus.Connecting, 1e3)
        ]);

        dj.channel = dj.voiceState.channel;
        dj.channelId = dj.channel.id;
      } catch (e) {
        console.log(e);
        this._data.delete(channel.guild.id);
        connection.destroy();
      }
    });
  }

  leave(id) {
    this._data.get(id).leave();
  }
}

module.exports = ClientMusicManager;
