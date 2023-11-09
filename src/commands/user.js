const {
	SlashCommandBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} = require('discord.js')
const axios = require("axios");

const config = require("../config")();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("user")
		.setDescription("Check a users statistics")
		.addUserOption(option =>
			option.setName("user")
			.setDescription("Select the user you want to view")
			.setRequired(false)
	    ),

	async execute(interaction) {
		var userData = await axios.get([
			config.url,
			"/api/guild/217055651371679745/user/",
			interaction.options.get("user").id
		].join())

		await interaction.reply({content: userData, ephemeral: true})
	},
};