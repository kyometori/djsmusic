# @kyometori/djsmusic
[![npm version](https://img.shields.io/npm/v/@kyometori/djsmusic.svg?maxAge=3600)](https://www.npmjs.com/package/@kyometori/djsmusic) [![downloads](https://img.shields.io/npm/dt/@kyometori/djsmusic.svg?maxAge=3600)](https://www.npmjs.com/package/@kyometori/djsmusic)   [![downloads](https://img.shields.io/github/last-commit/kyometori/djsmusic)](https://github.com/kyometori/djsmusic) [![downloads](https://img.shields.io/github/languages/code-size/kyometori/djsmusic)](https://github.com/kyometori/djsmusic)
## Warning
This package is still under heavy developement, so there might be some breaking changes.
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
const client = new Client({ intents: ['GUIDLS', 'GUILD_VOICE_STATES'] });

client.once('ready' () => {
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

## Documentation
### createMusicManager
```js
createMusicManager (Client client, Object options, String property)
```
Build a music manager on `client[property]`. If no property supports it'll automatically use `music`. The `options` will be automatically applied to the Manager options.

### ClientMusicManager
#### constructor
```js
new ClientMusicManager (Client client, {
    defaultMaxQueueSize, // the default maximum size of queue, will be automatically applied to all its `GuildMusicManager`
    disableAutoplay      // if set to `true`, it won't automatically play the next song of the queue
})
```

#### properties
* `client` : the client that instantiated this
* `connections` : (readonly) A Map contains all this manager's `GuildMusicManager`, mapped by their id.

#### methods
* `has(Snowflake id)` : if we have connection of the guild of given id in our data
* `get(Snowflake id)` : get the GuildMusicManager object that handle the guild of given id
* `join({ VoiceChannel channel, Boolean setMute, Boolean setDeaf })` : join the given voice channel and self mute or deaf if given. Returns a `Promise<GuildMusicManager>` which is the manager of joined guild.
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
  * Params: `Track track` the track just finished
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
});
```
When track is construct automatically by given Youtube URL in `GuildMusicManager`, its `details` property will includes:
* `thumbnailUrl` : the thumbnail url of this song
* `channelName` : the name of channel
* `channelUrl` : the url of channel
* `uploadDate` : the formatted upload date of this song
* `viewCount` : the view count of this song in Youtube
* `ytUrl` : the url of the song in Youtube


#### properties
* `manager` : the manager that instantiated this.
* `title` : the title of this track
* `lengthSeconds` : the length of this song, in seconds.
* `player` : who pick this song. this is required but can be anything such as 'unknown', a `GuildMember` Object etc.
* `details` : the detail metadata of this track

#### events
* `end` : emits after this track finish playing

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

Also we assume your `ClientMusicManager` is on `<Client>.music`.

### Join
```js
<Client>.music.join({ channel: <Channel> });
```

### Leave
```js
<Client>.music.leave(<Id>);
// or :
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
* Raw `mp3`, `mp4`, `wav`, `ogg`, `aac` files. The url must ended with `.(file extensions)`
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
<Client>.music.get(<Id>).nowPlaying
```

### Logging when song is finished
```js
const manager = <Client>.music.get(<Id>)
manager.on('end', () => {
   if (manager.hasNext()) console.log('Start playing next song...');
   else console.log('Finish all queued songs!');
});
```

For more examples you can look at our [example bot](https://github.com/kyometori/djsmusic/tree/main/examples) or look up our Documentation and create features yourself!

## Thanks
[Junior HiZollo](https://hizollo.ddns.net) : My another project which is a Discord bot with music feature. This library is basically rewriting its music (which was also wrtten by me) and make it generic.
