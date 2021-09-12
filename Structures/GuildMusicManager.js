const EventEmitter = require('events');
const Track = require('./Track.js')
const { createAudioPlayer, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

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
    this.MAX_QUEUE_SIZE = maxQueueSize;
    this.isPlaying = false;
    this.nowPlaying = {};

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.nowPlaying.emit('end');
      if (!this.manager.disableAutoplay && this.queue.length) {
        return this.playTrack(this.next())
      }

      this.emit('finish');
      this.isPlaying = false;
      this.nowPlaying = {};
    });
  }

  play(url, customMetadata, force = false) {
    if (!url) throw new Error('MISSING_URL');
    if (this.queue.length >= this.MAX_QUEUE_SIZE) throw new Error('QUEUE_OVERSIZE');
    let success = false;

    function filter(url) {
      return ['.mp3', '.mp4', 'wav', 'ogg', 'aac'].some(ext => url.endsWith(ext));
    }

    let track;
    if (filter(url)) {
      track = new Track(url, customMetadata);
      success = true;
    }

    const YT_VIDEO = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;

    if (YT_VIDEO.test(url)) {
      success = true;
    }

    if (!success) throw new Error('UNSUPPORTED_URL_TYPE');
    this.queue.push(track);

    if (force || !this.isPlaying) this.playTrack(this.queue.shift());

    return new Promise(resolve => {
      resolve(track)
    });
  }

  next() {
    if (!this.queue.length) return undefined;
    return this.queue.shift();
  }

  pause() {
    console.log(this.player.state.status)
    if (this.player.state.status === AudioPlayerStatus.Paused) throw new Error('ALREADY_PAUSED');
    this.player.pause();
  }

  resume() {
    if (this.player.state.status !== AudioPlayerStatus.Paused) throw new Error('ALREADY_PAUSED');
    this.player.unpause();
  }

  skip() {
    if (this.player.state.status !== AudioPlayerStatus.Playing &&
        this.player.state.status !== AudioPlayerStatus.Paused) throw new Error('NO_RESOURCES_PLAYING');
    this.player.stop(true);
  }

  leave() {
    getVoiceConnection(this.guild.id).destroy();
    this.manager._data.delete(this.guild.id);
    this.emit('leave', this.guild);
  }

  playTrack(track) {
    this.player.play(track.getStream());
    this.nowPlaying = track;
    this.isPlaying = true;
    this.emit('play', track);
  }
}

module.exports = GuildMusicManager;
