const registerCommands = require("../registerCommands");

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`${client.user.tag} is Online`);
		for (const server of client.guilds.cache) {
			registerCommands(client, server[0]);
		}
	},
};