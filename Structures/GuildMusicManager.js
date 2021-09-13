const EventEmitter = require('events');
const ytdl = require('ytdl-core');
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
      this.emit('end', this.nowPlaying);
      if (!this.manager.disableAutoplay && (this.queue.length || this.nowPlaying.isLooping)) {
        return this.playTrack(this.next())
      }

      this.emit('finish');
      this.isPlaying = false;
      this.nowPlaying = {};
    });
  }

  async play(url, customMetadata = {}, force = false) {
    if (!url) throw new Error('MISSING_URL');
    if (!customMetadata.player) throw new Error('UNKNOWN_PLAYER');
    if (this.queue.length >= this.MAX_QUEUE_SIZE) throw new Error('QUEUE_OVERSIZE');
    let queued = true;
    let success = false;

    function filter(url) {
      return ['.mp3', '.mp4', '.wav', '.ogg', '.aac'].some(ext => url.endsWith(ext));
    }

    // Raw files
    let track;
    if (filter(url)) {
      track = new Track(url, this, customMetadata);
      success = true;
    }

    // Youtube links
    const YT_VIDEO = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;

    if (YT_VIDEO.test(url)) {
      const info = await ytdl.getInfo(url);
      if (!info) throw new Error('INVALID_YOUTUBE_URL');
      if (!info.videoDetails.isCrawlable) throw new Error('UNPLAYABLE_YOUTUBE_URL');

      function audioFilter(formats) {
        for (const ele of formats)
          if (ele.codecs === 'opus' && ele.container === 'webm' && ele.audioSampleRate === '48000')
              return ele.url;
      }

      const audioUrl = audioFilter(info.formats);
      track = new Track(audioUrl, this, {
        title: customMetadata.title ?? info.videoDetails.title.replace(/[!@#$%^&*()_\/\-+=\[\]?<>\\\|]/g, input => `\\${input}`),
        lengthSeconds: info.videoDetails.lengthSeconds,
        player: customMetadata.player,
        details: {
          thumbnailUrl: info.videoDetails.thumbnails.pop().url,
          channelName: info.videoDetails.ownerChannelName,
          channelUrl: info.videoDetails.ownerProfileUrl,
          uploadDate: info.videoDetails.uploadDate,
          viewCount: info.videoDetails.viewCount,
          ytUrl: url,
          ...customMetadata.details
        }
      });

      success = true;
    }

    if (!success) throw new Error('UNSUPPORTED_URL_TYPE');

    this.queue.push(track);
    if (force || !this.isPlaying) {
      this.playTrack(this.queue.shift());
      queued = false;
    }

    return [track, queued];
  }

  hasNext() {
    return this.nowPlaying.isLooping || !!this.queue.length;
  }

  next() {
    if (this.nowPlaying.isLooping) return this.nowPlaying;
    if (!this.queue.length) return undefined;
    return this.queue.shift();
  }

  setLoop(loop) {
    this.nowPlaying.isLooping = loop;
  }

  seek(time) {
    this.player.play(this.nowPlaying.getStream(time));
  }

  pause() {
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
    this.manager.emit('leave', this.guild);
  }

  playTrack(track) {
    this.player.play(track.getStream());
    this.nowPlaying = track;
    this.isPlaying = true;
    this.emit('play', track);
  }
}

module.exports = GuildMusicManager;
