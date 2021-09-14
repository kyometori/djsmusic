const YoutubeChannelData = require('./YoutubeChannelData.js');

class YoutubeVideoData {
  constructor(rawData) {
    if (rawData.type !== 'video') throw new Error('INVALID_DATA');
    this.type = rawData.type;
    this.title = rawData.title;
    this.url = rawData.url;
    this.thumbnailUrl = rawData.bestThumbnail?.url;
    this.duration = rawData.duration;

    this.channel = new YoutubeChannelData({
      type: 'channel',
      ...rawData.author
    });
  }

  play(manager, customMetadata, force) {
    return manager.play(this.url, customMetadata, force);
  }
}

module.exports = YoutubeVideoData;
