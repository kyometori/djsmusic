const EventEmitter = require('events');
const { createAudioResource, StreamType } = require('@discordjs/voice');
const prism = require('prism-media');

class Track extends EventEmitter {
  constructor(audioUrl, metadata = {
    title: 'unknown',
    lengthSecond: Infinity,
    player: 'unknown',
    details: {}
  }) {
    super();
    this.audioUrl = audioUrl;
    this.title = metadata.title;
    this.lengthSecond = metadata.lengthSecond;
    this.player = metadata.player;
    this.details = metadata.details;
  }

  getStream(seektime = 0) {
    if (seektime * 1000 > this.lengthSecond) throw new Error('INVALID_SEEK_TIME');
    // ffmpeg 的參數
    const FFMPEG_OPUS_ARGUMENTS = ['-i', this.audioUrl, '-ss', ~~(seektime)/1000, '-analyzeduration', '0', '-loglevel', '0', '-acodec', 'libopus', '-f', 'opus', '-ar', '48000', '-ac', '2', ];
    // 使用 prism-media 把參數綁上音樂傳給 stream
    // 這是為了讓音樂不會到一半自動斷線結束
    const stream = new prism.FFmpeg({
        args : ['-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5', ...FFMPEG_OPUS_ARGUMENTS ]
    });
    // 建立可播放的物件並回傳
    const resource = this.resource = createAudioResource(stream, { inputType: StreamType.OggOpus , inlineVolume : true })
    return resource;
  }
}

module.exports = Track;
