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
const getServer = require("../getServer");
const styleNumber = require("../styleNumber");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("user")
		.setDescription("Check a users statistics")
		.addUserOption(option =>
			option.setName("user")
			.setDescription("Select the user you want to view")
			.setRequired(false)
	    ),
	
	options: ["server"],

	async execute(client, interaction) {
		var guildId = await getServer(interaction);

		var user;

		if (!interaction.options.getUser("user")) {
			user = interaction.user.id;
		} else {
			user = interaction.options.getUser("user").id;
		}

		var { data } = await axios.get(config.url + `/api/guild/${guildId}/user/` + user)

		if (data) {
			var tag;

			if (data.discriminator === "0") {
				tag = data.username;
			}
			else {
				tag = data.username + "#" + data.discriminator;
			}

		    var embed = new EmbedBuilder()
			    .setColor(client.embedColor)
				.setAuthor({ name: tag, iconURL: data.avatarUrl })
				.addFields(
					{ name: "Rank", value: `#${data.rank}`, inline: true },
					{ name: "Level", value: `${data.level}`, inline: true },
					{ name: "Average XP", value: `${styleNumber((data.averageXp || 0))}`, inline: true },

					//{ name: '\u200B', value: '\u200B' },

					/*{ name: "Total XP", value: String(data.totalXp), inline: true },

					{ name: "Hourly XP", value: String(data.hourlyXp) },
					{ name: "Daily XP", value: String(data.dailyXp), inline: true },
					{ name: "Weekly XP", value: String(data.weeklyXp), inline: true },
					{ name: "Monthly XP", value: String(data.monthlyXp), inline: true },

					{ name: "Total Msgs", value: String(data.messageCount), inline: true },

					{ name: "Hourly Msgs", value: String(data.hourlyMsg), inline: true },
					{ name: "Daily Msgs", value: String(data.dailyMsg), inline: true },
					{ name: "Weekly Msgs", value: String(data.weeklyMsg), inline: true },
					{ name: "Monthly Msgs", value: String(data.monthlyMsg), inline: true },*/

					{ name: "Total", value: `${styleNumber(data.totalXp)} Xp \n${styleNumber(data.messageCount)} Msgs`, inline: true },

					{ name: "Hourly", value: `${styleNumber(data.hourlyXp)} Xp \n${styleNumber(data.hourlyMsg)} Msgs`, inline: true },
					{ name: "Daily", value: `${styleNumber(data.dailyXp)} Xp \n${styleNumber(data.dailyMsg)} Msgs`, inline: true },
					{ name: "Weekly", value: `${styleNumber(data.weeklyXp)} Xp \n${styleNumber(data.weeklyMsg)} Msgs`, inline: true },
					{ name: "Monthly", value: `${styleNumber(data.monthlyXp)} Xp \n${styleNumber(data.monthlyMsg)} Msgs`, inline: true },

					{ name: "To Level Up", value: `${styleNumber((data.levelXp - data.userXp))} Xp \n${styleNumber(((data.levelXp - data.userXp) / (data.averageXp || 20)))} Msgs`, inline: true },
				)
				.setTimestamp()
				.setImage("https://kewwie.com/assets/full_embed.png")

			await interaction.reply({embeds: [embed], ephemeral: false});
		} else {
			await interaction.reply({content: "This user doesn't have any stats", ephemeral: true});
		}
	},
};