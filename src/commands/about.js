const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("Get info about the service"),
	
	guilds: [1154327161990295592],

	async execute(interaction) {
		await interaction.reply("Coming Soon\n**[View Website](http://localhost:3000/)**");
	},
};