const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const config = require("./config")();
const getServers = require("./getServers");
const getServerOptions = require("./getServerOptions");

module.exports = async (client, server) => {
    var commandData = [];

    for (const command of client.commands.values()) {
        if (!command.global) {
            var cmdData = command.data.toJSON();
            if (!(await getServers()).some(obj => obj.guildId === server)) {
                if (command.options && (command.options).includes("server")) {
                    var serverOption = {
                        choices: await getServerOptions(),
                        type: 3,
                        name: 'server',
                        description: 'The server you want to view starts for',
                        required: false,
                    }
                    cmdData.options.push(serverOption);
                }
            }
            commandData.push(cmdData);
        }
    }

    new REST({version: '10'}).setToken(config.discord.token)
        .put(Routes.applicationGuildCommands(config.discord.id, server), {body: commandData})
        .then(() => console.log(`[${server}] Registered Application Commands`))
        .catch(console.error);
}