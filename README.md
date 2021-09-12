# This is WIP
# Discord.js Voice
This is a simple wrapper of @discordjs/voice library. You can use this package to build a music bot with your discord.js client easily.   
**We are not discord.js developers!**   
**This package is not related to discord.js official!**   
**If you have any questions about this package, please don't ask in their supports**
```js
const { Client } = require('discord.js');
const { createMusicManager } = require('discordjs-voice');
const client = new Client({ intents: ['GUIDLS', 'GUILD_VOICE_STATES'] });

client.once('ready' () => {
  createMusicManager(client);
  console.log('Everything is ready!');
});

client.on('interactionCreate', interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'join') {
    interaction.client.music.join(interaction.guild.id);
  }

  if (interaction.commandName === 'play') {
    const url = interaction.options.getString('url');
    interaction.client.music.get(interaction.guild.id).play(url);
  }
});

client.login('your-token-goes-here');
```

# Documentation
## createMusicManager
```js
createMusicManager (Client client, Object options, String property)
```
Build a music manager on `client[property]`. If no property supports it'll automatically use music. The `options` will be automatically applied to the Manager options.

## ClientMusicManager
### constructor
```js
new ClientMusicManager (Client client, {
    defaultMaxQueueSize // the default maximium size of queue, will be automatically apllied to all its `GuildMusicManager`
    disableAutoplay     // if set to `true`, it won't automatically play the next song in queue
})
```

### properties
- `client` : the client that instantiated this

### methods
- `has (Snowflake id)` : if we have connection of the guild of given id in our data
- `get (Snowflake id)` : get the GuildMusicManager object that handle the guild of given id
- `join ({ VoiceChannel channel, Boolean setMute, Boolean setDeaf })` : join the given voice channel and self mute or deaf if given.
- `leave (Snowflake id)` : leave the guild of given id.

### events
- `join` : Emit after your client joined a channel.
  - Params: `Guild guild` the joined guild
- `leave` : Emit after your client left a channel.
  - Params: `Snowflake guildId` the id of left guild.

## GuildMusicManager
### constructor
```js
new GuildMusicManager ({
    Client client,               // client of your bot
    ClientMusicManager manager,  // music manager of your client
    VoiceChannel channel,        // the voice channel joined
    Number maxQueueSize          // the max size of this manager's queue
})
```

### properties
- `client` : the Client that instantiated this
- `guild` : the guild of this manager
- `channel` : the VoiceChannel that instantiated this
- `manager` : the ClientMusicManager that instantiated this
- `voiceState` : the voiceState of Client
- `player` : the player of this manager
- `queue` : the queue of this manager
- `MAX_QUEUE_SIZE` : the max size of this manager's queue
- `isPlaying` : is this manager's player playing
- `nowPlaying` : empty object if nothing is playing, or a `Track` object when there's something

### methods
- `play(String url, Object customMetadata, Boolean force)` : The url of music you want to play. If the url is unsupported, it'll throw a `UNSUPPORTED_URL_TYPE` exception. customMetadata can be access through Track#details. Force is to determine to skip what's playing now or queue this song if there are already something playing.  Returns a Promise with `Track` object.
- `next()` : Get and remove the first song of the queue. Behave same as `GuildMusicManager#queue.shift()`.
- `pause()` : pause what's playing
- `resume()` : unpause what's playing
- `skip()` : skip what's playing
- `leave()` : leave the voice channel and kill this manager

### events
- `play` : emit  after
  - Params: `Track track` the track is played
- `leave` : emit after client left this guild
  - Params: `Guild guild` the guild of this manager
- `finish` : emit after every song in queue finished playing

## Track
### constructor
```js
new Track({
    audioUrl // the audio resource url of this track
    metadata: {
        title        // title of this track, default unknown
        lengthSecond // length of this track, default Infinity
        player       // the one choose play this song, default unknown
        details      // Other metadata of this track, default empty object
    }
});
```
When track is constuct automatically by given Youtube URL in `GuildMusicManager`, its `detail` property includes:
- `channelName` : the name of channel
- `channelUrl` : the url of channel
- `uploadDate` : the formatted upload date of this song
- `viewCount` : the view count of this song in Youtube
- `ytUrl` : the url of the song in Youtube

### events
- `end` : emits after this track finish playing
