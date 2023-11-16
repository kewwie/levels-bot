const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { readdirSync } = require("node:fs");

const config = require("../config")();

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFiles = readdirSync(`./src/commands`).filter((file) => file.endsWith(".js"));
            
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.data.name, command);
            client.commandList.push(command.data.toJSON());

            /*if (!command.guilds) {
                client.CommandList.push(command.data.toJSON());
            } else {
                for (var guild of command.guilds)
                    var commandGuilds = client.CommandGuilds.find(o => o.guild === guild);
                    if (!commandGuilds) { commandGuilds = [] };
                    commandGuilds.push(command.data.toJSON());
                    console.log(client.CommandGuilds.shift())
                    //client.CommandGuilds[guild] = commandGuilds;
                    // Replace object in array 
            }*/
        }

        if (config.status !== "DEV") {
            new REST({version: '10'}).setToken(config.discord.token)
                .put(Routes.applicationCommands(config.discord.id), {body: client.commandList})
                .then(() => console.log('Successfully registered application commands.'))
                .catch(console.error);
        } else {
            new REST({version: '10'}).setToken(config.discord.token)
                .put(Routes.applicationGuildCommands(config.discord.id, config.testServer), {body: client.commandList})
                .then(() => console.log('Successfully registered test application commands.'))
                .catch(console.error);
        }
        
        
        
       /* console.log(client.CommandGuilds)
        for (var guild of client.CommandGuilds) {
            console.log(111)
            new REST({version: '10'}).setToken(config.discord.token)
                .put(Routes.applicationGuildCommands(config.discord.id, guild), {body: client.commandList})
                .then(() => console.log('Successfully registered application commands.'))
                .catch(console.error);
        }*/

    } 
}