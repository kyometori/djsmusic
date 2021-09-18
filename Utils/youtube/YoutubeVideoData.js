const ytdl = require('ytdl-core');
const BaseVideoData = require('../BaseVideoData.js');
const YoutubeChannelData = require('./YoutubeChannelData.js');
const YoutubeUtils = require('./YoutubeUtils.js');

class YoutubeVideoData extends BaseVideoData {
  constructor(rawData) {
    super(rawData);
    this.title = rawData.title;
    this.url = rawData.url;
    this.isCrawlable = rawData.isCrawlable;
    this.thumbnailUrl = rawData.bestThumbnail?.url;
    this.lengthSeconds = rawData.lengthSeconds;
    this.uploadDate = rawData.uploadDate;
    this.viewCount = rawData.viewCount;
    this.audioUrl = rawData.audioUrl;

    this.channel = new YoutubeChannelData({
      type: 'channel',
      ...rawData.author
    });
  }

  play(manager, customMetadata, force) {
    return manager.play(this.url, customMetadata, force);
  }

  fetch() {
    return ytdl
      .getInfo(this.url)
      .then(info => {
        const audioUrl = audioFilter(info.formats);


        this.title = info.videoDetails.title;
        this.isCrawlable = info.videoDetails.isCrawlable;
        this.lengthSeconds = info.videoDetails.lengthSeconds;
        this.thumbnailUrl = info.videoDetails.thumbnails.pop().url;
        this.uploadDate = info.videoDetails.uploadDate;
        this.viewCount = info.videoDetails.viewCount;
        this.audioUrl = audioUrl,
        this.channel = new YoutubeChannelData({
          type: 'channel',
          name: info.videoDetails.ownerChannelName,
          url: info.videoDetails.ownerProfileUrl,
          channelID: info.videoDetails.channelId,
          verified: info.videoDetails.author.verified
        });

        return this;
      })
      .catch(() => {
        throw new Error('FETCH_ERROR');
      })
  }
}

function audioFilter(formats) {
  for (const ele of formats)
    if (ele.codecs === 'opus' && ele.container === 'webm' && ele.audioSampleRate === '48000')
        return ele.url;
}

module.exports = YoutubeVideoData;
