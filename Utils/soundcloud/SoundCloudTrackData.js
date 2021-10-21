class SoundCloudTrackData {
  constructor(rawData) {
    this.type = 'track';
    this.id = rawData.id;
    this.title = rawData.title;
    this.description = rawData.description;
    this.lengthSeconds = rawData.duration / 1000;
    this.thumbnail = rawData.thumbnail;
    this.url = rawData.url;
    this.playCount = rawData.playCount;
    this.genre = rawData.genre;

    this._raw = rawData;
  }

}

module.exports = SoundCloudTrackData;
