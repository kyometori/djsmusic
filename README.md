# This is WIP
# Discord.js Voice
This is a simple wrapper of @discordjs/voice library. You can use this package to build a music bot with your discord.js client easily.   
**We are not discord.js developers! This package is unsupported in discord.js official supports, so don't ask questions about this there.**
```js
const { Client } = require('discord.js');
const { createMusicManager } = require('discordjs-voice');
const client = new Client({ intents: ['GUIDLS', 'GUILD_VOICE_STATES'] });

createMusicManager(client);

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
createMusicManager (Client client, String property)
```
Build a music manager on `client[property]`. If no property supports it'll automatically use music.

## ClientMusicManager
### constructor
```js
ClientMusicManager (Client client)
```

### properties
- `client` : the client that instantiated this

### methods
- `has (Snowflake id)` : if we have connection of the guild of given id in our data
- `get (Snowflake id)` : get the GuildMusicManager object that handle the guild of given id
- `join ({ VoiceChannel channel, Boolean setMute, Boolean setDeaf })` : join the given voice channel and self mute or deaf if given.
- `leave (Snowflake id)` : leave the guild of given id.

## GuildMusicManager
### constructor
```js
GuildMusicManager ({
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
- `nowPlaying` : empty object if nothing is playing, or Track object when there's something

### methods
- `play(String url)` : The url of music you want to play. If the url is unsupported, it'll throw a `UNSUPPORTED_URL_TYPE` exception.
- `leave()` : leave the voice channel and kill this manager
