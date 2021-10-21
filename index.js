const ClientMusicManager = require('./Structures/ClientMusicManager.js');

module.exports = {
  /**
   * function createMusicManager
   * You only need this and Utils for normal usage
   */
  createMusicManager: (client, options = {}, property = 'music') => {
    client[property] = new ClientMusicManager(client, options);
  },

  // Structures
  ClientMusicManager: ClientMusicManager,
  GuildMusicManager: require('./Structures/GuildMusicManager.js'),
  Track: require('./Structures/Track.js'),

  // Utils
  //// Youtube
  YoutubeUtils: require('./Utils/youtube/YoutubeUtils.js'),
  YoutubeVideoData: require('./Utils/youtube/YoutubeVideoData'),
  YoutubeChannelData: require('./Utils/youtube/YoutubeChannelData'),
  YoutubePlaylistData: require('./Utils/youtube/YoutubePlaylistData'),
  //// Soundcloud
  SoundCloudUtils: require('./Utils/soundcloud/SoundCloudUtils.js'),
  SoundCloudTrackData: require('./Utils/soundcloud/SoundCloudTrackData.js')

}
