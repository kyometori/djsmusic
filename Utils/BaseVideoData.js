class BaseVideoData {
  constructor(rawData) {
    if (rawData.type !== 'video') throw new Error('INVALID_DATA');
    this.type = rawData.type;
  }

  play(manager, customMetadata, force) {
    throw new Error('NOT_IMPLEMENTED');
  }
}

module.exports = BaseVideoData;
