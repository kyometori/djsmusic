const SoundCloud = require('soundcloud-scraper');
const SoundCloudTrackData = require('./SoundCloudTrackData.js');

class SoundCloudUtils {
  constructor() { throw new Error('CANNOT_INSTANTIATED') }

  static isSoundCloudLink(link) {
    const SC_LINK_FIRST = /^(https?:\/\/)?(www.)?(m\.)?soundcloud\.com\/[\w\-\.]+(\/)+[\w\-\.]+\/?(\?[\w\W\d\D]+)?$/gi;
    const SC_LINK_SECOND = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/gi;
    return SC_LINK_FIRST.test(link) && SC_LINK_SECOND.test(link);
  }

  static getTrackData(link) {
    const client = new SoundCloud.Client();
    return client.getSongInfo(link)
      .then(data => new SoundCloudTrackData(data));
  }
}
module.exports = SoundCloudUtils;
