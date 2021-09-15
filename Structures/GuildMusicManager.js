const EventEmitter = require('events');
const ytdl = require('ytdl-core');
const Track = require('./Track.js')
const YoutubeUtils = require('../Utils/youtube/YoutubeUtils.js');
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

  async play(url, customMetadata = {}, force = !this.manager.enableQueue) {
    if (!url) throw new Error('MISSING_URL');
    if (!customMetadata.player) throw new Error('UNKNOWN_PLAYER');
    if (this.queue.length >= this.MAX_QUEUE_SIZE) throw new Error('EXCEED_QUEUE_MAXSIZE');
    let queued = true;
    let success = false;

    url = url.trim();

    function filter(url) {
      return ['.mp3', '.mp4', '.wav', '.ogg', '.aac'].some(ext => url.endsWith(ext));
    }

    // Raw files
    let track;
    if (this.manager.enableService.rawFile && filter(url)) {
      track = new Track(url, this, customMetadata);
      success = true;
    }

    if (this.manager.enableService.youtube && YoutubeUtils.isYoutubeLink(url)) {
      const data = await YoutubeUtils
        .getVideoData(url);
      if (!data.isCrawlable) throw new Error('UNPLAYABLE_YOUTUBE_URL');

      track = new Track(data.audioUrl, this, {
        title: customMetadata.title ?? data.title,
        lengthSeconds: data.lengthSeconds,
        player: customMetadata.player,
        details: {
          thumbnailUrl: data.thumbnailUrl,
          channelName: data.channel.name,
          channelUrl: data.channel.url,
          uploadDate: data.uploadDate,
          viewCount: data.viewCount,
          ytUrl: data.url,
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

  setVolume(number) {
    if (!this.manager.enableInlineVolume) throw new Error('INLINE_VOLUME_DISABLED');
    this.nowPlaying.volume = number;
    this.nowPlaying.resource.volume.setVolume(number);
    if (this.nowPlaying.volume > 3) console.log('Warning: You\'re setting a volume that\'s louder than 3 times of the original. Please check if you really need this to protect your ears.');
  }

  getVolume() {
    return this.nowPlaying.volume;
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
