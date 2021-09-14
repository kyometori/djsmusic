const ytsr = require('ytsr');

class YoutubeChannelData {
  constructor(rawData) {
    if (rawData.type !== 'channel') throw new Error('INVALID_DATA');
    this.type = rawData.type;
    this.name = rawData.name;
    this.channelId = rawData.channelID;
    this.url = rawData.url;
    this.avatarUrl = rawData.bestAvatar?.url;
    this.verified = rawData.verified;
  }

  fetch() {
    return ytsr(this.name, 50)
      .then(({ items }) => {
        items = items.filter(v => v.type === 'channel' && v.channelID === this.channelId);
        return items[0];
      })
      .then(result => {
        if (result?.type !== 'channel') throw new Error('FETCH_CHANNEL_FAILED');
        this.name = result.name;
        this.channelId = result.channelID;
        this.url = result.url;
        this.avatarUrl = result.bestAvatar?.url;
        this.descriptionShort = result.descriptionShort;
        this.verified = result.verified;

        return this;
      })
  }
}

module.exports = YoutubeChannelData;
