const { readdirSync } = require("node:fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const config = require("../config")();

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFiles = readdirSync(`./src/commands`).filter((file) => file.endsWith(".js"));
        var globalCommands = [];

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.data.name, command);

            if (command.global) {
                globalCommands.push(command.data.toJSON());
            }
        }

        if (globalCommands.length > 0) {
            new REST({version: '10'}).setToken(config.discord.token)
                .put(Routes.applicationCommands(config.discord.id), {body: globalCommands})
                .then(() => console.log('Registered Global Application Commands'))
                .catch(console.error);
        }
    } 
}