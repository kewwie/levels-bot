const registerCommands = require("../registerCommands");

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`${client.user.tag} is Online`);
		for (const server of client.guilds.cache) {
			await registerCommands(client, server[0]);
		}
	},
};