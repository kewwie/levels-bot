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
		.setName("compare")
		.setDescription("Compare a users statistics")
		.addUserOption(option =>
			option.setName("user1")
			.setDescription("Select the 1st user")
			.setRequired(true)
	    )
		.addUserOption(option =>
			option.setName("user2")
			.setDescription("Select the 2nd user")
			.setRequired(true)
	    ),

	async execute(client, interaction) {
		var user1, user2;

		if (!interaction.options.getUser("user1")) {
			user1 = interaction.user.id;
		} else {
			user1 = interaction.options.getUser("user1").id;
		}

		if (!interaction.options.getUser("user2")) {
			user2 = interaction.user.id;
		} else {
			user2 = interaction.options.getUser("user2").id;
		}
	}
}