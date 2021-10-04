export = YoutubePlaylistData;
declare class YoutubePlaylistData {
    constructor(rawData: any);
    type: any;
    title: any;
    url: any;
    data: any;
    firstVideoThumbnailUrl: any;
    channel: YoutubeChannelData;
    fetch(page?: number): any;
}
import YoutubeChannelData = require("./YoutubeChannelData.js");
