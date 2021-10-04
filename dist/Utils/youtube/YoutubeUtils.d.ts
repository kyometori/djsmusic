export = YoutubeUtils;
declare class YoutubeUtils {
    static isYoutubeLink(link: any): boolean;
    static isPlaylistLink(link: any): boolean;
    static getVideoData(link: any): any;
    static getPlaylistData(link: any, page?: number): any;
    static searchFirstVideo(keywords: any): any;
    static search(keywords: any, max?: number, { disableChannel, disablePlaylist, disableVideo }?: {
        disableChannel?: boolean;
        disablePlaylist?: boolean;
        disableVideo?: boolean;
    }): any;
}
