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

	async execute(client, interaction) {
		var user;

		if (!interaction.options.getUser("user")) {
			user = interaction.user.id;
		} else {
			user = interaction.options.getUser("user").id;
		}

		var { data } = await axios.get(config.url + "/api/guild/217055651371679745/user/" + user)

		console.log(data);
		if (data) {
			var tag;

			if (data.discriminator === "0") {
				tag = data.username;
			}
			else {
				tag = data.username + "#" + data.discriminator;
			}

			console.log(data.hourlyXp)
		    var embed = new EmbedBuilder()
			    .setColor(client.embedColor)
				.setAuthor({ name: tag, iconURL: data.avatarUrl })
				.addFields(
					{ name: "Rank", value: `#${data.rank}`, inline: true },
					{ name: "Level", value: `${data.level}`, inline: true },

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

					{ name: "Total", value: `${data.totalXp} Xp \n ${data.messageCount} Msgs`, inline: true },

					{ name: "Hourly", value: `${data.hourlyXp} Xp \n ${data.hourlyMsg} Msgs`, inline: true },
					{ name: "Daily", value: `${data.dailyXp} Xp \n ${data.dailyMsg} Msgs`, inline: true },
					{ name: "Weekly", value: `${data.weeklyXp} Xp \n ${data.weeklyMsg} Msgs`, inline: true },
					{ name: "Monthly", value: `${data.monthlyXp} Xp \n ${data.monthlyMsg} Msgs`, inline: true },

					{ name: "XP to Level Up", value: String(data.levelXp - data.userXp), inline: true },
					{ name: "Messages to Level Up", value: String((data.levelXp - data.userXp) / 20), inline: true },

				)
				.setTimestamp()
				.setImage("https://kewwie.com/assets/full_embed.png")

			await interaction.reply({embeds: [embed], ephemeral: false});
		} else {
			await interaction.reply({content: "This user doesn't have any stats", ephemeral: true});
		}
	},
};