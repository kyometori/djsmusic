const YoutubeChannelData = require('./YoutubeChannelData.js');

class YoutubePlaylistData {
  constructor(rawData) {
    if (rawData.type !== 'playlist') throw new Error('INVALID_DATA');
    this.type = rawData.type;
    this.title = rawData.title;
    this.url = rawData.url;
    this.firstVideoThumbnailUrl = rawData.firstVideo.bestThumbnail?.url;

    this.channel = new YoutubeChannelData({
      type: 'channel',
      ...rawData.owner
    });
  }

}

module.exports = YoutubePlaylistData;
