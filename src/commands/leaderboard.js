const { 
	SlashCommandBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} = require('discord.js');
const { Pagination } = require('pagination.djs');
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

        var { data } = await axios.get(
            config.url +
            "/api/guild/217055651371679745/leaderboard?" +
            new URLSearchParams({
                limit: 10 * 100
            })
        );

        if (data.message) {
			await interaction.reply({content: "No data found", ephemeral: true});
			return;
		}

		if (data.length <= 0) {
			await interaction.reply({content: "Noone has gained xp", ephemeral: true});
			return;
		}

        var type = interaction.options.getString("type")
        var leaderboard = interaction.options.getString("leaderboard")

        const getSearch = (value, reverse = false) => {
            if (leaderboard === "all-time") {
                if (reverse) {
                    if (value === "xp") { return `messageCount` };
                    if (value === "message") { return `totalXp` };
                }
                if (value === "xp") { return `totalXp` };
                if (value === "message") { return `messageCount` };
            }

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

        const styleSearch = (value) => {
            return value.toLocaleString('en-US', {
                style: 'decimal',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
        }
        
        data = data.filter((obj) => obj[getSearch(type)] > 0).sort(function(a, b) { return b[getSearch(type)] - a[getSearch(type)] });

        console.log(data)

        var embeds = [];

        for (var page = 0; (data.length / 10) > page; page++) {

            players = data.slice(page * 10,  (page + 1) * 10);
            var fields = [], lbRank = 0 + (10 * page);

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
                    value: `${styleSearch(player[getSearch(type)])} ${getDisplay(type)} (${styleSearch(player[getSearch(type, true)])} ${getDisplay(type, false, true)})`,
                    inline: false
                });
            }
            const embed = new EmbedBuilder({fields: fields});

            embed.setColor(client.embedColor)
            embed.setTitle(`${getDisplay(leaderboard)} ${getDisplay(type, true)} Leaderboard`);
            embed.setImage("https://kewwie.com/assets/full_embed.png")

            embeds.push(embed);
        }
        
        const pagination = new Pagination(interaction, {
            firstEmoji: '⏮', // First button emoji
            prevEmoji: '◀️', // Previous button emoji
            nextEmoji: '▶️', // Next button emoji
            lastEmoji: '⏭', // Last button emoji
            limit: null, // number of entries per page
            idle: 30 * 1000, // idle time in ms before the pagination closes
            ephemeral: false, 
            prevDescription: '',
            postDescription: '',
            attachments: [],
            buttonStyle: ButtonStyle.Primary,
            loop: false
        });
        pagination.setEmbeds(embeds, (embed, index, array) => {
            return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` });
        });
        pagination.render();
        

	    /*const getRow = (userId) => {
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
		});*/
	},
};