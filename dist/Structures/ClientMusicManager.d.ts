export = ClientMusicManager;
declare class ClientMusicManager extends EventEmitter {
    constructor(client: any, options?: {});
    client: any;
    _data: Map<any, any>;
    defaultMaxQueueSize: any;
    enableQueue: any;
    enableAutoplay: any;
    enableInlineVolume: any;
    enableService: any;
    has(id: any): boolean;
    get(id: any): any;
    get connections(): Map<any, any>;
    join({ channel, setMute, setDeaf, maxQueueSize }: {
        channel: any;
        setMute: any;
        setDeaf: any;
        maxQueueSize: any;
    }): Promise<any>;
    leave(id: any): void;
}
import EventEmitter = require("events");
