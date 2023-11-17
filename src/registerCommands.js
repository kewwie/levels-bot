const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const axios = require("axios");

const config = require("./config")();

const getServers = async () => {
    var { data } = await axios.get(config.url + "/api/guilds");
    return data;
}

const getServersOption = async () => {
    var data = [];

    for (const server of await getServers()) {
        data.push({ name: server.name, value: server.guildId });
    }

    return data;
}


module.exports = async (client, server) => {

    var dataToAdd = {
        choices: await getServersOption(),
        autocomplete: undefined,
        type: 3,
        name: 'server',
        name_localizations: undefined,
        description: 'Kewwie is amazing',
        description_localizations: undefined,
        required: false,
        max_length: undefined,
        min_length: undefined
    }

    var commandData = [];

    if (!(await getServers()).some(obj => obj.guildId === server)) {
        commandData = client.commandList;
        for (const command of commandData) {
            command.options.push(dataToAdd);
        }
        console.log(commandData[0], server)
    }

    commandData = client.commandList;

    new REST({version: '10'}).setToken(config.discord.token)
        .put(Routes.applicationGuildCommands(config.discord.id, Number(server)), {body: commandData})
        .then((value) => console.log(value))
        .catch(console.error);
}