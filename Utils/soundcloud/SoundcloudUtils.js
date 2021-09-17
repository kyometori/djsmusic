class SoundcloudUtils {
  constructor() { throw new Error('CANNOT_INSTANTIATED') }

  static isSoundcloudLink(link) {
    const SC_VIDEO = /^(https?:\/\/)?(www.)?(m\.)?soundcloud\.com\/[\w\-\.]+(\/)+[\w\-\.]+\/?(\?[\w\W\d\D]+)?$/gi;
    return SC_VIDEO.test(link);
  }

  // static getData(soundcloudClient, link) {
  //   return soundcloudClient.tracks.getTrack(link);
  // }
}
module.exports = SoundcloudUtils;
