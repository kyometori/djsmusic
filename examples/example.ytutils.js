const { YoutubeUtils } = require('../');

/**
 I use this in this way since I hope the result can log in order.
 Depends on your needs, the async/await can be removed.
 If you're not famaliar with Promise, please learn it first before using this package.
 We use this everywhere here.
**/
(async () => {

// Search a single video with query and log it
// Use `searchFirstVideo`
await YoutubeUtils.searchFirstVideo('Kotoha')
  // data is an `YoutubeVideoData` Object
  .then(data => {
    console.log(data);
    return data;
  })
  // let's fetch this video
  .then(data => {
    data.fetch().then(console.log);
  })
  // an error is thrown when not found
  .catch(e => {
    console.log(e)
    console.log('No results :(');
  });

console.log('-------------------------------');

// Get a list of videos title with query
// Use `search`

await YoutubeUtils.search('HoneyWorks')
  // results is type `Array<YoutubeVideoData>`
  // Notice that this won't throw errors when not no results
  // You have to handle this situation yourself
  .then(results => {
    if (!results.length) return "No results :(";
    return results.map(v => v.title).join('\n')
  })
  .then(console.log);

console.log('-------------------------------');

await YoutubeUtils.getVideoData('https://www.youtube.com/watch?v=srzVhDN2zME')
  .then(data => {
    console.log(data);
    return data.channel;
  })
  .then(channel => {
    console.log(channel);
    return channel
  })
  .then(channel => {
    channel.fetch().then(console.log)
  })

console.log('-------------------------------');

// Get Channel description
await YoutubeUtils.searchFirstVideo('Mafumafu')
  .then(data => data.channel)
  .then(channel => {
    channel.fetch().then(console.log);
  })
  .catch(() => {
    console.log("No results :(")
  });

})();
