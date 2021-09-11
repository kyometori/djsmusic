const ClientMusicManager = require('./Structures/ClientMusicManager.js');

module.exports = {
  createMusicManager: (client, property = 'music') => {
    client[property] = new ClientMusicManager(client);
  }
}
