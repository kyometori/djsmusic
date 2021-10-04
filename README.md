# @kyometori/djsmusic
[![npm version](https://img.shields.io/npm/v/@kyometori/djsmusic.svg?maxAge=3600)](https://www.npmjs.com/package/@kyometori/djsmusic) [![downloads](https://img.shields.io/npm/dt/@kyometori/djsmusic.svg?maxAge=3600)](https://www.npmjs.com/package/@kyometori/djsmusic)   [![downloads](https://img.shields.io/github/last-commit/kyometori/djsmusic)](https://github.com/kyometori/djsmusic) [![downloads](https://img.shields.io/github/languages/code-size/kyometori/djsmusic)](https://github.com/kyometori/djsmusic)
## Warning
This package is still under heavy development, so there might be some breaking changes.
We'll try to make breaking changes as less as we can, but if there's any, we're sorry about that.
## Introduction
This is a simple wrapper of @discordjs/voice library.   
You can use this package to build a music bot with your discord.js client easily.   
**We are not discord.js developers!**   
**This package is not related to discord.js official!**   
**If you have any questions about this package, please don't ask in their supports**   
```js
const { Client } = require('discord.js');
const { createMusicManager } = require('@kyometori/djsmusic');
const client = new Client({ intents: ['GUILDS', 'GUILD_VOICE_STATES'] });

client.once('ready', () => {
  createMusicManager(client);
  console.log('Everything is ready!');
});

client.on('interactionCreate', interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'join') {
    interaction.client.music.join({
      channel: interaction.member.voice.channel
    });
  }

  if (interaction.commandName === 'play') {
    const url = interaction.options.getString('url');
    interaction.client.music.get(interaction.guild.id).play(url);
  }
});

client.login('your-token-goes-here');
```

## Table of contents
- [Requirements](#requirements)
- [Documentation](#documentation)
  - [createMusicManager](#createmusicmanager)
  - [ClientMusicManager](#clientmusicmanager)
  - [GuildMusicManager](#guildmusicmanager)
  - [Track](#track)
  - [BaseVideoData](#basevideodata)
  - [YoutubeUtils](#youtubeutils)
  - [YoutubeVideoData](#youtubevideodata)
  - [YoutubeChannelData](#youtubechanneldata)
  - [YoutubePlaylistData](#youtubeplaylistdata)
- [Examples](#examples)
- [Example usages](#example-usages)
  - [Join and Leave](#join-and-leave)
  - [Play](#play)
  - [Pause and Resume](#pause-and-resume)
  - [Toggle Looping](#toggle-looping)
  - [Seek a time](#seek-a-time)
  - [Get NowPlaying Data](#get-nowplaying-data)
  - [Volume Increase](#volume-increase)
  - [Logging when song is finished](#logging-when-song-is-finished)
  - [Leave when queue is finished](#leave-when-queue-is-finished)
  - [Search and play the most related song by keywords](#search-and-play-the-most-related-song-by-keywords)
- [Thanks](#thanks)

## Requirements
To use this package, you must meet these requirements:
* discord.js version > 13
* FFmpeg Dependency. Can be one of those below:
  * [`FFmpeg`](https://ffmpeg.org) (installed and added to environment)
  * `ffmpeg-static` (npm install)

## Documentation
### createMusicManager
```js
createMusicManager (Client client, Object options, String property)
```
Build a music manager on `client[property]`. If no property supply, it'll automatically use `music`. The `options` will be automatically applied to the Manager options.

This is the most important object in this package. For most usage you only need to import this (and some utils below) for your bot.

### ClientMusicManager
#### constructor
```js
new ClientMusicManager (Client client, {
    Number defaultMaxQueueSize, // the default maximum size of queue, will be automatically applied to all its `GuildMusicManager`
    Boolean enableQueue,         // whether we should enable the default queue system
    Boolean enableAutoplay,      // if set to `false`, it won't automatically play the next song of the queue
    Boolean enableInlineVolume,  // whether should inline volume be enable
    Object enableService : {     // determine which service should be enable
      Boolean rawFile,           // ability to play raw file
      Boolean youtube            // ability to play youtube link directly
    }
})
```
Every boolean property is set to `true` except `enableInlineVolume` due to better performance. If you want to have the feature of 'adjust volumen during playing' you have to set this to true.   
In default `defaultMaxQueueSize` is 99. Can set to `Infinity` if you don't want a limit.   
The `enableService` is for you to enable or disable some service if you don't want your bot to play that.

#### properties
* `client` : the client that instantiated this
* `connections` : (readonly) A Map contains all this manager's `GuildMusicManager`, mapped by their id.

#### methods
* `has(Snowflake id)` : if we have connection of the guild of given id in our data
* `get(Snowflake id)` : get the GuildMusicManager object that handle the guild of given id
* `join({ VoiceChannel channel, Boolean setMute, Boolean setDeaf, Number maxQueueSize })` : join the given voice channel and self mute or deaf if given. Returns a `Promise<GuildMusicManager>` which is the manager of joined guild.
* `leave(Snowflake id)` : leave the guild of given id.

#### events
* `join` : Emit after your client joined a channel.
  * Params: `Guild guild` the guild of joined channel.
* `leave` : Emit after your client left a channel.
  * Params: `Guild guild` the guild of left channel.

### GuildMusicManager
#### constructor
```js
new GuildMusicManager ({
    Client client,               // client of your bot
    ClientMusicManager manager,  // music manager of your client
    VoiceChannel channel,        // the voice channel joined
    Number maxQueueSize          // the max size of this manager's queue
})
```

#### properties
* `client` : the Client that instantiated this
* `guild` : the guild of this manager
* `channel` : the VoiceChannel that instantiated this
* `manager` : the ClientMusicManager that instantiated this
* `voiceState` : the voiceState of Client
* `player` : the player of this manager
* `queue` : the queue of this manager
* `MAX_QUEUE_SIZE` : the max size of this manager's queue
* `isPlaying` : is this manager's player playing
* `nowPlaying` : empty object if nothing is playing, or a `Track` object when there's something

#### methods
* `play(String url, Object customMetadata, Boolean force)` : The url of music you want to play. If the url is unsupported, it'll throw a `UNSUPPORTED_URL_TYPE` Error. `customMetadata` can be access through `Track` and `Track#details`. Force is to determine to skip what's playing now or queue this song if there are already something playing.  Returns a `Promise<[Track, Boolean]>`. The `Track` object is the song you just queue or play, and the `Boolean` is this song is queued or not (playing directly).
* `next()` : Get and remove the first song of the queue. If it's looping, it'll return what's playing now.
* `hasNext()` : Does this manager has next song. If current track is looping it always returns true.
* `seek(Number time)` : Seek a specific time of current song. Time is in milliseconds. If the number is larger than the total time it'll throw a `INVALID_SEEK_TIME` Error.
* `getVolume()` : get current volume. If it's `2` means the volume is `2x` louder than default.
* `setVolume(Number number)` : set the volume of current track. You have to enable inline volume in the `ClientMusicManager` to use this function.
* `pause()` : pause what's playing
* `resume()` : unpause what's playing
* `skip()` : skip what's playing
* `leave()` : leave the voice channel and kill this manager

#### events
* `play` : emit  after a track started playing
  * Params: `Track track` the track is played
* `leave` : emit after client left this guild
  * Params: `Guild guild` the guild of this manager
* `end` : emit when a song is finished playing (same as Track#end)
  * Params: `Track next` the track that's gonna play after this track. If no then it will be `undefined`.
* `finish` : emit after every song in queue finished playing

### Track
#### constructor
```js
new Track({
    audioUrl, // the audio resource url of this track
    manager,  // the GuildMusicManager playing this track
    metadata: {
        title         // title of this track, default unknown
        lengthSeconds // length of this track, default Infinity
        player        // the one choose play this song, required
        details       // Other metadata of this track, default empty object
    }
})
```
When track is construct automatically by given Youtube URL in `GuildMusicManager`, its `details` property will includes:
* `from` : Always `'Youtube'`. You can use this to determine where this track is.
* `data` : A `YoutubeVideoData` object. You can find its properties below.


#### properties
* `manager` : the manager that instantiated this.
* `title` : the title of this track
* `lengthSeconds` : the length of this song, in seconds.
* `player` : who pick this song. this is required but can be anything such as 'unknown', a `GuildMember` Object etc.
* `details` : the detail metadata of this track
* `isLooping` : whether this track looping or not
* `playedMs` : (readonly) how many milliseconds the track played

#### events
* `end` : emits after this track finish playing

### BaseVideoData
#### constructor
```js
new BaseVideoData(rawData) // raw data from those module
```

#### properties
* `type` : always `'video'`

#### methods
* `play(GuildMusicManager manager, Object customMetadata, Boolean force)` : (abstract) should be implements as using manager to play with the given custom metadata.

### YoutubeUtils
#### methods
* `isYoutubeLink(String link)` : (static) check if the link is a Youtube link.
* `isPlaylistLink(String link)` : (static) check if the link is a Youtube playlist link.
* `getVideoData(String link)` : (static) get the data of the video. Returns a `YoutubeVideoData` object if find it, or throw an Error when not data is not found.
* `searchFirstVideo(String keywords)` : (static) Use the keywords to search, and return the first (most related) video. Returns a `YoutubeVideoData` Object.
* `search(String keywords, Number max, { Boolean disableChannel, Boolean disablePlaylist, Boolean disableVideo })` : (static) Use the keywords to search, and return at most `max` results. You can use `disableSomething` to pull the type you don't want from results. In default only video is enable. Returns an Array of `YoutubeObjectData`, which is one of `YoutubeVideoData`, `YoutubeChannelData`, `YoutubePlaylistData`.

### YoutubeVideoData
#### constructor
```js
new YoutubeVideoData(rawData) // raw data from ytsr
// you can construct this by passing your own data, but you need `type: 'video'` guard in the data or will cause an Error.
```

#### properties
* `type` : always `'video'`
* `title` : title of this video
* `url` : youtube url of this video
* `isCrawlable` : can this video be crawl.
* `thumbnailUrl` : url of this video's thumbnail
* `uploadDate` : the date this video uploaded, formatted in `yyyy-mm-dd`.
* `viewCount` : the viewCount of this video.
* `audioUrl` : the original audio file url of this video.
* `channel` : channel uploaded this video. This is a `YoutubeChannelData` Object.

#### methods
* `play(GuildMusicManager manager, Object customMetadata, Boolean force)` : Play this video. This behave same as `GuildMusicManager#play`. Returns same thing with `GuildMusicManager#play`.
* `fetch()` : Fetch this video and fullfill those `undefined` properties.

### YoutubeChannelData
#### constructor
```js
new YoutubeChannelData(rawData) // raw data from ytsr
// you can construct this by passing your own data, but you need `type: 'channel'` guard in the data or will cause an Error.
```

#### properties
* `type` : always `'channel'`
* `name` : name of this channel
* `channelId` : id of this channel
* `url` : url to this channel
* `descriptionShort` : short description of this channel, if any. Notice that if this is from `YoutubeVideoData#channel` or `YoutubePlaylistData#channel`, you have to fetch to get this.
* `avatarUrl` : url to avatar of this channel. Notice that if this is from `YoutubePlaylistData#channel`, you have to fetch to get this.
* `verified` : whether this channel is verified or not

#### methods
* `fetch()` : Fetch this channel to get missing properties. Return `Promise<YoutubeChannelData>`. Notice this use `name` and `channelId` to get data. An error will occurred when one missing. Also it will refresh all data of this object if the fetched data is different from your original data (most happened in construct this object manually).

### YoutubePlaylistData
#### constructor
```js
new YoutubePlaylistData(rawData) // raw data from ytsr
// you can construct this by passing your own data, but you need `type: 'playlist'` guard in the data or will cause an Error.
```

#### properties
* `type` : always `playlist`.
* `title` : the title of this playlist.
* `url` : url of this playlist.
* `firstVideoThumbnailUrl` : thumbnail of this playlist's first video
* `channel` : channel created this playlist. This is a `YoutubeChannelData` Object.

## Examples
Examples can be found [here](https://github.com/kyometori/djsmusic/tree/main/examples).

## Example usages
These examples assume:
* `<Client>` : Your bot's client
* `<Channel>` : the target channel
* `<Id>` : the target guild id
* `<Url>` : the links
* `<User>` : the one pick this song
* `<Time>` : a time in unit milliseconds
* `<Keywords>` : Search keywords

Also we assume your `ClientMusicManager` is on `<Client>.music`.

### Join and Leave
```js
// join
<Client>.music.join({ channel: <Channel> });

// leave #1
<Client>.music.leave(<Id>);

// leave #2
<Client>.music.get(<id>).leave();
```

### Play
```js
// Normal playing
<Client>.music.get(<Id>).play(<Url>, { player: <User> });

// With promise
<Client>.music
    .get(<Id>)
    .play(<Url>, { player: <User> })
    .then(([track, queued]) => {
        if (queued) console.log(`${track.title} is queued!`);
        else console.log(`${track.title} is playing!`);
    });
```
The `url` parameter of the `play` method accept following urls:
* Raw `mp3`, `mp4`, `wav`, `ogg`, `aac`, `flac` files. The url must ended with `.(file extension)`
* A Youtube link.

### Pause and Resume
```js
<Client>.music.get(<Id>).pause();
<Client>.music.get(<Id>).resume();
```

### Toggle Looping
```js
const manager = <Client>.music.get(<id>);
manager.setLoop(!manager.nowPlaying.isLooping);
```

### Seek a time
```js
<Client>.music.get(<Id>).seek(<Time>);
```

### Get NowPlaying Data
```js
// If anything is playing, this will be a Track object
// Otherwise it's an empty Object
<Client>.music.get(<Id>).nowPlaying;
```

### Volume Increase
```js
const manager = <Client>.music.get(<id>);
manager.setVolume(manager.getVolume() + 0.1);
```
Notice you have to enable inline volume when create your `ClientMusicManager` to use this feature.

### Logging when song is finished
```js
const manager = <Client>.music.get(<Id>);
manager.on('end', next => {
   if (!next) console.log('Finish all queued songs!');
   else console.log('Start playing next song...');
});
```

### Leave when queue is finished
```js
<Client>.music
  .join({ channel: <Channel> })
  .then(manager => {
    manager.once('finish', () => {
      manager.leave();
    });
  });
```
This code implements both join and set up leave-when-finished.

### Search and play the most related song by keywords
```js
YoutubeUtils.searchFirstVideo(<Keywords>)
  .then(data => {
    data.play(<Client>.music.get(<Id>), { player: <User> });
  })
  .catch(err => {
    console.log(err);
  });
```

For more examples you can look at our [examples](https://github.com/kyometori/djsmusic/tree/main/examples) or look up our Documentation and create features yourself!

## Thanks
[Junior HiZollo](https://hizollo.ddns.net) : My another project which is a Discord bot with music feature. This library is basically rewriting its music (which was also wrtten by me) and make it generic.
