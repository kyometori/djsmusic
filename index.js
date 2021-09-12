const ClientMusicManager = require('./Structures/ClientMusicManager.js');

module.exports = {
  createMusicManager: (client, options = {}, property = 'music') => {
    if (typeof defaultMaxQueueSize !== 'number' || !defaultMaxQueueSize instanceof Number)
      throw new Error('TYPE_ERROR');
    client[property] = new ClientMusicManager(client, options);
  }
}
