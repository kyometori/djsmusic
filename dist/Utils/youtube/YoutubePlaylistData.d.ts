export = YoutubePlaylistData;
declare class YoutubePlaylistData {
    constructor(rawData: any);
    type: any;
    title: any;
    url: any;
    firstVideoThumbnailUrl: any;
    channel: YoutubeChannelData;
}
import YoutubeChannelData = require("./YoutubeChannelData.js");
