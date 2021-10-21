export = YoutubeVideoData;
declare class YoutubeVideoData {
    constructor(rawData: any);
    type: any;
    title: any;
    url: any;
    isCrawlable: any;
    thumbnailUrl: any;
    lengthSeconds: any;
    uploadDate: any;
    viewCount: any;
    audioUrl: any;
    channel: YoutubeChannelData;
    play(manager: any, customMetadata: any, force: any): any;
    fetch(): any;
}
import YoutubeChannelData = require("./YoutubeChannelData.js");
