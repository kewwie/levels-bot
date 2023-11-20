const registerCommands = require("../registerCommands");
const config = require("../config")();

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