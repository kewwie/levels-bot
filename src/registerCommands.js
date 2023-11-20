const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const axios = require("axios");

const config = require("./config")();
const getServers = require("./getServers");

module.exports = async (client, server) => {
    var commandData = [];

    for (const command of client.commands.values()) {
        if (!command.global) {
            var cmdData = command.data.toJSON();
            if (!(await getServers()).some(obj => obj.guildId === server)) {
                if (command.options) {
                    if ((command.options).includes("serverOptions")) {
                        var serverOptions = [];

                        for (const server of await getServers()) {
                            serverOptions.push({ name: server.name, value: server.guildId });
                        }
                    }

                    if ((command.options).includes("server")) {
                        var serverOption = {
                            choices: serverOptions,
                            type: 3,
                            name: 'server',
                            description: 'The server you want to view starts for',
                            required: false,
                        }
                        cmdData.options.push(serverOption);
                    }

                    if ((command.options).includes("settings_user_servers_option")) {
                        cmdData.options[0].options[0].options[0].choices = serverOptions;
                    }
                    if ((command.options).includes("settings_server_servers_option")) {
                        cmdData.options[1].options[0].options[0].choices = serverOptions;
                    }
                    if ((command.options).includes("settings_channel_servers_option")) {
                        cmdData.options[1].options[1].options[1].choices = serverOptions;
                    }
                    if ((command.options).includes("exclusive")) {
                        commandData.push(cmdData);
                    }
                }
            }
            if (command.options && !((command.options).includes("exclusive"))) {
                commandData.push(cmdData);
            }
        }
    }

    new REST({version: '10'}).setToken(config.discord.token)
        .put(Routes.applicationGuildCommands(config.discord.id, server), {body: commandData})
        .then(() => console.log(`[${server}] Registered Application Commands`))
        .catch(console.error);
}