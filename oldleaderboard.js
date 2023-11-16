const { 
	SlashCommandBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} = require('discord.js');
const axios = require("axios");
const config = require("./src/config")();

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
					{ name: 'Message Leaderboard', value: 'message' },
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
		var pageCount = 0;
		var page = 0;

		var { data } = await axios.get(
			config.url +
			"/api/guild/217055651371679745/leaderboard?" +
			new URLSearchParams({
				limit: 10 * 100
			})
		);

		var type = interaction.options.getString("type")
		var leaderboard = interaction.options.getString("leaderboard")
		if (type && leaderboard) {
			if (type === "xp") { type = "Xp" };
			if (type === "message") { type = "Msgs" };

			console.log(`${leaderboard}${type}`)

			data = data.filter((obj) => obj[`${leaderboard}${type}`] > 0)
		}

		if (data.message) {
			await interaction.reply({content: "No data found", ephemeral: true});
			return;
		}

		if (data.length <= 0) {
			await interaction.reply({content: "Noone has gained xp", ephemeral: true});
			return;
		}
		pageCount = data.length / 10;

		const getPage = async (pageId) => {
			

			var { data } = await axios.get(
				config.url +
				"/api/guild/217055651371679745/leaderboard?" +
				new URLSearchParams({
					limit: 10 * 100
				})
			);
	
			var type = interaction.options.getString("type")
			var leaderboard = interaction.options.getString("leaderboard")

			const getSearch = (value, reverse = false) => {
				if (reverse) {
					if (value === "xp") { return `${leaderboard}Msg` };
					if (value === "message") { return `${leaderboard}Xp` };
                }

				if (value === "xp") { return `${leaderboard}Xp` };
				if (value === "message") { return `${leaderboard}Msg` };
			}

			const getDisplay = (value, full = false, reverse = false) => {
				if (reverse) {
					if (value === "xp") { value = "Messages" };
					if (value === "message") { value = "Xp" };
                }

				if (!full) {
					if (value === "message") { value = "Messages" };
				}

				return value.charAt(0).toUpperCase() + value.slice(1)
			}
			
			data = data.filter((obj) => obj[getSearch(type)] > 0)

			players = data.slice(page * 10,  (page + 1) * 10);


			var fields = [];
			var lbRank = 0;

		    for (const player of players) {
				var tag;

				if (player.discriminator === "0") {
					tag = player.username;
				}
				else {
					tag = player.username + "#" + player.discriminator;
				}

				if (tag.includes("__")) {
					tag = "```" + tag + "```";
				}

				lbRank++;
				fields.push({
					name: `${lbRank}. ${tag}`,
					value: `${player[getSearch(type)]} ${getDisplay(type)} (${player[getSearch(type, true)]} ${getDisplay(type, false, true)})`,
					inline: false
				});
			}
			const embed = new EmbedBuilder({fields: fields});

			embed.setColor(client.embedColor)
			embed.setTitle(`${getDisplay(leaderboard)} ${getDisplay(type, true)} Leaderboard`);
			embed.setImage("https://kewwie.com/assets/full_embed.png")
			
			return embed;
		}

	    const getRow = (userId) => {
			const row = new ActionRowBuilder();

			row.addComponents(
				new ButtonBuilder({
					custom_id: 'prev_leaderboard',
					style: ButtonStyle.Secondary,
					label: 'Previous',
				})
				.setDisabled(page === 0)
			);

			row.addComponents(
				new ButtonBuilder({
					custom_id: 'next_leaderboard',
					style: ButtonStyle.Secondary,
					label: 'Next',
				})
				.setDisabled(page === pageCount - 1)
			);

			return row;
		}

		page = page || 0;

		const filter = (i) => i.user.id === interaction.user.id;
		const time = 1000 * 60 * 5;

		await interaction.reply({
			ephemeral: false,
			embeds: [await getPage(page)],
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
				btnInt.customId === "prev_leaderboard" && page > 0
			) {
				--page;
			} else if (
				btnInt.customId === "prev_leaderboard" && page <  pageCount - 1
			) {
				++page;
			}

			interaction.editReply({
				embeds: [getPage([pages[interaction.user.id]])],
				components: [getRow(interaction.user.id)]
			})
		});
	},
};