const ytpl = require('ytpl');
const YoutubeVideoData = require('./YoutubeVideoData.js');
const YoutubeChannelData = require('./YoutubeChannelData.js');

class YoutubePlaylistData {
  constructor(rawData) {
    if (rawData.type !== 'playlist') throw new Error('INVALID_DATA');
    this.type = rawData.type;
    this.title = rawData.title;
    this.url = rawData.url;
    this.data = rawData.data;
    this.firstVideoThumbnailUrl = rawData.firstVideo?.bestThumbnail?.url;

    this.channel = new YoutubeChannelData({
      type: 'channel',
      ...rawData.owner
    });
  }

  fetch(page=Infinity) {
    return ytpl(this.url, { page: page })
      .then(playlist => {
        const videos = playlist.items.map(v => {
          return new YoutubeVideoData({
            type: 'video',
            url: v.shortUrl,
            isCrawlable: v.isPlayable,
            bestThumbnail: v.bestThumbnail,
            lengthSeconds: v.durationSec,
            author: v.author
          });
        });


        this.title = playlist.title;
        this.firstVideoThumbnailUrl = playlist.bestThumbnail?.url;
        this.data = videos;
        this.channel = new YoutubeChannelData({
          type: 'channel',
          ...playlist.author
        });

        return this;
      })
      .catch(() => {throw new Error('INVALID_PLAYLIST_URL')});
  }

}

module.exports = YoutubePlaylistData;
