export = Track;
declare class Track extends EventEmitter {
    constructor(audioResource: any, manager: any, metadata: any);
    audioResource: any;
    manager: any;
    title: any;
    lengthSeconds: any;
    player: any;
    details: any;
    isLooping: boolean;
    volume: number;
    startTimeMs: number;
    get playedMs(): any;
    getStream(seektime?: number): any;
    resource: any;
}
import EventEmitter = require("events");
