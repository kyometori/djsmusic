const ClientMusicManager = require('./Structures/ClientMusicManager.js');

module.exports = {
  createMusicManager: (client, options = {}, property = 'music') => {
    client[property] = new ClientMusicManager(client, options);
  }
}
