const { SoundCloudUtils } = require('../');

SoundCloudUtils.getTrackData('https://soundcloud.com/alanwalker/alan-walker-fade')
  .then(console.log)
