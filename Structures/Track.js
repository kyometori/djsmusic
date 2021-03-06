const EventEmitter = require('events');
const { createAudioResource, StreamType } = require('@discordjs/voice');
const prism = require('prism-media');

class Track extends EventEmitter {
  constructor(audioResource, manager, metadata) {
    super();
    if (!metadata.player) throw new Error('MISSING_PLAYER');
    this.audioResource = audioResource;
    this.manager = manager;
    this.title = metadata.title ?? 'unknown';
    this.lengthSeconds = metadata.lengthSeconds ?? Infinity;
    this.player = metadata.player;
    this.details = metadata.details ?? details;

    this.isLooping = false;
    this.volume = 1;
    this.startTimeMs = 0;
  }

  get playedMs() {
    return this.resource.playbackDuration + this.startTimeMs;
  }

  getStream(seektime = 0) {
    if (isNaN(+seektime)) throw new Error('TYPE_ERROR');
    if (seektime < 0 || seektime > this.lengthSeconds * 1000) throw new Error('INVALID_SEEK_TIME');
    this.startTimeMs = seektime;
    // ffmpeg 的參數
    const FFMPEG_OPUS_ARGUMENTS = ['-i', this.audioResource, '-ss', ~~(seektime)/1000, '-analyzeduration', '0', '-loglevel', '0', '-acodec', 'libopus', '-f', 'opus', '-ar', '48000', '-ac', '2', ];
    // 使用 prism-media 把參數綁上音樂傳給 stream
    // 這是為了讓音樂不會到一半自動斷線結束
    const stream = new prism.FFmpeg({
        args : ['-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5', ...FFMPEG_OPUS_ARGUMENTS ]
    });
    // 建立可播放的物件並回傳
    const resource = this.resource = createAudioResource(stream, {
      inputType: StreamType.OggOpus,
      inlineVolume : this.manager.manager.enableInlineVolume
    });
    return resource;
  }
}

module.exports = Track;
