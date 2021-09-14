const ytsr = require('ytsr');
const YoutubeVideoData = require('./YoutubeVideoData.js');
const YoutubeChannelData = require('./YoutubeChannelData.js');
const YoutubePlaylistData = require('./YoutubePlaylistData.js');

class YoutubeUtils {
  constructor() { throw new Error('CANNOT_INSTANTIATED') }

  /** Returns a Promise of YoutubeVideoData object **/
  static searchFirstVideo(keywords) {
    return ytsr(keywords, { limit: 15 })
      .then(({ items }) => {
        return items.filter(r => r.type === 'video')
      })
      .then(results => {
        if (!results.length) throw new Error('NO_RESULTS');
        return new YoutubeVideoData(results[0]);
      });
  }

  /** Returns an Promise of Array of YoutubeData **/
  // The max means the search limit, not how many result will be returned
  static search(keywords, max=10, { disableChannel=true, disablePlaylist=true, disableVideo=false } = {}) {
    if (disableChannel && disablePlaylist && disableVideo) throw new Error('DISABLE_EVERYTHING');

    return ytsr(keywords, { limit: max })
      .then(({ items }) => {
        return items.filter(r => {
          if (disableChannel && r.type === 'channel') return false;
          if (disablePlaylist && r.type === 'playlist') return false;
          if (disableVideo && r.type === 'video') return false;
          return true;
        });
      })
      .then(results => {
        return results
          .filter(v => ['channel', 'playlist', 'video'].includes(v.type))
          .map(v => {
            switch(v.type) {
              case 'video':
                return new YoutubeVideoData(v);
              case 'channel':
                return new YoutubeChannelData(v);
              case 'playlist':
                return new YoutubePlaylistData(v);
              default:
                throw new Error('UNKNOWN_TYPE');
            }
          })
      });
  }
}

module.exports = YoutubeUtils;
