const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const YoutubeVideoData = require('./YoutubeVideoData.js');
const YoutubeChannelData = require('./YoutubeChannelData.js');
const YoutubePlaylistData = require('./YoutubePlaylistData.js');

class YoutubeUtils {
  constructor() { throw new Error('CANNOT_INSTANTIATED') }

  static isYoutubeLink(link) {
    const YT_VIDEO = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    return YT_VIDEO.test(link);
  }

  static isPlaylistLink(link) {
    const YT_PLAYLIST = /^.*(list=)([^#\&\?]*).*/gi;
    return YoutubeUtils.isYoutubeLink(link) && YT_PLAYLIST.test(link);
  }

  /** Returns a Promise of YoutubeVideoData object **/
  static getVideoData(link) {
    return ytdl
      .getInfo(link)
      .then(info => {
        const audioUrl = audioFilter(info.formats);

        return new YoutubeVideoData({
          type: 'video',
          title: info.videoDetails.title,
          url: link,
          isCrawlable: info.videoDetails.isCrawlable,
          lengthSeconds: info.videoDetails.lengthSeconds,
          bestThumbnail: info.videoDetails.thumbnails.pop(),
          uploadDate: info.videoDetails.uploadDate,
          viewCount: info.videoDetails.viewCount,
          audioUrl: audioUrl,
          author: {
            name: info.videoDetails.ownerChannelName,
            url: info.videoDetails.ownerProfileUrl,
            channelID: info.videoDetails.channelId,
            verified: info.videoDetails.author.verified
          }
        });
      })
      .catch(() => {throw new Error('INVALID_YOUTUBE_URL')});
  }

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

function audioFilter(formats) {
  for (const ele of formats)
    if (ele.codecs === 'opus' && ele.container === 'webm' && ele.audioSampleRate === '48000')
        return ele.url;
}

module.exports = YoutubeUtils;
