export = YoutubeUtils;
declare class YoutubeUtils {
    static isYoutubeLink(link: any): boolean;
    static isPlaylistLink(link: any): boolean;
    /** Returns a Promise of YoutubeVideoData object **/
    static getVideoData(link: any): any;
    /** Returns a Promise of YoutubeVideoData object **/
    static searchFirstVideo(keywords: any): any;
    /** Returns an Promise of Array of YoutubeData **/
    static search(keywords: any, max?: number, { disableChannel, disablePlaylist, disableVideo }?: {
        disableChannel?: boolean;
        disablePlaylist?: boolean;
        disableVideo?: boolean;
    }): any;
}
