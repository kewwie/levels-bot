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
const styleNumber = require("../styleNumber");

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
		var user1, user2, idk = [];

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

		if (user1 === user2) {
			await interaction.reply({content: "Can't be the same user", ephemeral: true});
			return;
		}

		var userData1 = (await axios.get(config.url + "/api/guild/217055651371679745/user/" + user1)).data;
		var userData2 = (await axios.get(config.url + "/api/guild/217055651371679745/user/" + user2)).data;

		if (!userData1 && !userData2) {
			await interaction.reply({content: "One or both of the users doesn't have any stats", ephemeral: true});
			return;
		}
		
		const getUserDisplayStats = (user) => {
			var userStats = [
				`**Rank:** ${user.rank}`,
				`**Level:** ${user.level}`,
				`**Total Xp:** ${styleNumber(user.totalXp)}`,
				`**Average Xp:** ${styleNumber((user.averageXp || 20))}`,
				`**Hourly Xp:** ${styleNumber(user.hourlyXp)}`,
				`**Daily Xp:** ${styleNumber(user.dailyXp)}`,
				`**Weekly Xp:** ${styleNumber(user.weeklyXp)}`,
				`**Monthly Xp:** ${styleNumber(user.monthlyXp)}`,
				`**Messages:** ${styleNumber(user.messageCount)}`,
				`**Hourly Messages:** ${styleNumber(user.hourlyMsg)}`,
				`**Daily Messages:** ${styleNumber(user.dailyMsg)}`,
				`**Weekly Messages:** ${styleNumber(user.weeklyMsg)}`,
				`**Monthly Messages:** ${styleNumber(user.monthlyMsg)}`,
			];
			return userStats.join("\n");
		}

		var embed = new EmbedBuilder()
			.setColor(client.embedColor)
			.setTimestamp();

	    embed.addFields(
			{ name: `**${userData1.tag}**`, value: getUserDisplayStats(userData1), inline: true },
			{ name: '\u200B', value: '\u200B', inline: true },
			{ name: `**${userData2.tag}**`, value: getUserDisplayStats(userData2), inline: true },
		);

		//embed.setImage("https://kewwie.com/assets/full_embed.png")

		interaction.reply({embeds: [embed]});
	}
}