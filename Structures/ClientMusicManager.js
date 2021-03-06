const EventEmitter = require('events');
const GuildMusicManager = require('./GuildMusicManager.js');
const SoundCloud = require('soundcloud-scraper');
const { joinVoiceChannel,
        entersState,
        VoiceConnectionStatus } = require('@discordjs/voice');

class ClientMusicManager extends EventEmitter {
  constructor(client, options = {}) {
    if (!client) throw new Error('MISSING_CLIENT');
    super();
    this.client = client;

    this._data = new Map();
    this._soundcloudClient = new SoundCloud.Client();
    this.defaultMaxQueueSize = options.defaultMaxQueueSize ?? 99;
    this.enableQueue = options.enableQueue ?? true;
    this.enableAutoplay = options.disableAutoplay ?? true
    this.enableInlineVolume = options.enableInlineVolume ?? false;
    this.disableWarning = options.disableWarning ?? false;
    this.enableService = options.enableService ?? {
      rawFile: true,
      youtube: true,
      soundcloud: true
    }
  }

  has(id) {
    return this._data.has(id);
  }

  get(id) {
    if (this._data.has(id)) return this._data.get(id);
    return undefined;
  }

  get connections() {
    return new Map(this._data);
  }

  join({ channel, setMute, setDeaf, maxQueueSize }) {
    if (!channel.isVoice()) throw new Error('INVALID_CHANNEL_TYPE');
    if (!channel.joinable) throw new Error('MISSING_PERMISSIONS');

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
      channel: channel,
      maxQueueSize: maxQueueSize ?? this.maxQueueSize
    }));

    this.emit('join', channel.guild);

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
        this._data.delete(channel.guild.id);
        connection.destroy();
        this.emit('leave', channel.guild.id);
      }
    });

    return new Promise(resolve => resolve(dj));
  }

  leave(id) {
    this._data.get(id).leave();
  }
}

module.exports = ClientMusicManager;
