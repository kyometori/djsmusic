export = GuildMusicManager;
declare class GuildMusicManager extends EventEmitter {
    constructor({ client, manager, channel, maxQueueSize }: {
        client: any;
        manager: any;
        channel: any;
        maxQueueSize: any;
    });
    client: any;
    guild: any;
    channel: any;
    manager: any;
    voiceState: any;
    player: any;
    queue: any[];
    MAX_QUEUE_SIZE: any;
    isPlaying: boolean;
    nowPlaying: {};
    play(url: any, customMetadata?: {}, force?: boolean): Promise<(boolean | Track)[]>;
    hasNext(): any;
    next(): any;
    setVolume(number: any): void;
    getVolume(): any;
    setLoop(loop: any): void;
    seek(time: any): void;
    pause(): void;
    resume(): void;
    skip(): void;
    leave(): void;
    playTrack(track: any): void;
}
import EventEmitter = require("events");
import Track = require("./Track.js");
