const { 
	SlashCommandBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} = require('discord.js');
const axios = require("axios");
const config = require("../config")();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Register a vanity invite for your server")
		.addStringOption(option => 
			option.setName("type")
				.setDescription("The leaderboard you want to view")
				.setRequired(true)
				.addChoices(
					{ name: 'XP Leaderboard', value: 'xp' },
					{ name: 'Messages Leaderboard', value: 'message' },
				)
		)
		.addStringOption(option => 
			option.setName('leaderboard')
				.setDescription('The type of leaderboard you want in time')
				.setRequired(true)
				.addChoices(
					{ name: 'Hourly', value: 'hourly' },
					{ name: 'Daily', value: 'daily' },
					{ name: 'Weekly', value: 'weekly' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'All-Time', value: 'all-time' },
				)
		),

	async execute(client, interaction) {
		var embeds = [];
		var pages = {};

		for (let i = 0; i < 100; i++) {
			console.log(i);
			var embed = new EmbedBuilder();

			console.log([
				config.url,
				"/api/guild/217055651371679745/leaderboard/",
				"?limit=10",
				"&page=" + i,
				"&type=" + interaction.options.getString("type")
			].join())

			var pageData = await axios.get(
				config.url +
				"/api/guild/217055651371679745/leaderboard/" +
				new URLSearchParams({
					limit: 10,
					page: i,
					type: interaction.options.getString("type")
				})
			);

			for (const player of pageData) {
				var tag;

				if (player.discriminator === "0") {
					tag = player.username;
				}
				else {
					tag = player.username + "#" + player.discriminator
				}

				embed.addFields(
					{ name: tag, value: player },
				)
			}

			embeds.push(embed);
		}

	    const getRow = (userId) => {
			const row = new ActionRowBuilder();

			row.addComponents(
				new ButtonBuilder({
					custom_id: 'prev_leaderboard',
					style: ButtonStyle.Secondary,
					label: 'Previous',
				})
				.setDisabled(pages[userId] === 0)
			);

			row.addComponents(
				new ButtonBuilder({
					custom_id: 'next_leaderboard',
					style: ButtonStyle.Secondary,
					label: 'Next',
				})
				.setDisabled(pages[userId] === embeds.length - 1)
			);

			return row;
		}

		pages[interaction.user.id] = pages[interaction.user.id] || 0;

		const filter = (i) => i.user.id === interaction.user.id;
		const time = 1000 * 60 * 5;

		await interaction.reply({
			ephemeral: false,
			embeds: [embed],
			components: [getRow(page)]
		})
		
		collector = interaction.channel.createMessageComponentCollector({ filter, time });

		collector.on("collect", (btnInt) => {
			if (!btnInt) { return };

			btnInt.deferUpdate();

			if (
				btnInt.customId !== "prev_leaderboard" &&
				btnInt.customId !== "next_leaderboard"
			) { return };

			if (
				btnInt.customId === "prev_leaderboard" &&
				pages[interaction.user.id] > 0
			) {
				--pages[interaction.user.id];
			} else if (
				btnInt.customId === "prev_leaderboard" &&
				pages[interaction.user.id] <  embeds.length - 1
			) {
				++pages[interaction.user.id];
			}

			interaction.editReply({
				embeds: [embeds[pages[interaction.user.id]]],
				components: [getRow(interaction.user.id)]
			})
		});
	},
};