const {
	SlashCommandBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
    ChannelType,
    PermissionFlagsBits
} = require('discord.js')

const config = require("../config")();
const Data = require("../data");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("settings")
		.setDescription("Settings")
        .addSubcommandGroup(group =>
            group
                .setName('user')
                .setDescription('User Settings')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('default')
                        .setDescription('The default server for you in this guild')
        
                        .addStringOption(option => 
                            option.setName('server')
                            .setDescription('Select a server')
                            .setRequired(true)
                            .addChoices()
                        )
                )
        )
        .addSubcommandGroup(group =>
            group
                .setName('server')
                .setDescription('Server Settings')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('server-default')
                        .setDescription('The default server for a channel in this guild')
                        .addStringOption(option => 
                            option.setName('server')
                            .setDescription('Select a server')
                            .setRequired(true)
                            .addChoices()
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('channel-default')
                        .setDescription('The default server for a channel in this guild')
                        .addChannelOption(option => 
                            option.setName('channel')
                            .setDescription('Select a channel')
                            .addChannelTypes(ChannelType.GuildText)
                            .setRequired(true)
                        )
                        .addStringOption(option => 
                            option.setName('server')
                            .setDescription('Select a server')
                            .setRequired(true)
                            .addChoices()
                        )
                )
        ),
	
	options: [
        "excusive",
        "settings_user_servers_option",
        "settings_server_servers_option",
        "settings_channel_servers_option",
        "serverOptions"
    ],

	async execute(client, interaction) {
        var command = interaction.options.getSubcommand();

        switch (command) {
            case "default": { // User Default
                var guildId = interaction.guild.id;
                var userId = interaction.user.id;
                var server = interaction.options.getString("server")
                await Data.setUserDefault(guildId, userId, server);
                break;
            }
            case "server-default": { // Server Default
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    interaction.reply({content: "Only Admins can change this setting", ephemeral: true});
                    return;
                }
    
                var guildId = interaction.guild.id;
                var server = interaction.options.getString("server")
                await Data.setServerDefault(guildId, server);
                break;
            }
            case "channel-default": { // Channel Default
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                    interaction.reply({content: "Only Admins can change this setting", ephemeral: true});
                    return;
                }
                var guildId = interaction.guild.id;
                var channelId = interaction.options.getChannel("channel").id;
                var server = interaction.options.getString("server")
                await Data.setChannelDefault(guildId, channelId, server);
                break;
            }
        }

        interaction.reply({content: "Settings Saved!", ephemeral: true});
    }
}