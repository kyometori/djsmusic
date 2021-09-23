export = YoutubeVideoData;
declare class YoutubeVideoData extends BaseVideoData {
    title: any;
    url: any;
    isCrawlable: any;
    thumbnailUrl: any;
    lengthSeconds: any;
    uploadDate: any;
    viewCount: any;
    audioUrl: any;
    channel: YoutubeChannelData;
    fetch(): any;
}
import BaseVideoData = require("../BaseVideoData.js");
import YoutubeChannelData = require("./YoutubeChannelData.js");
