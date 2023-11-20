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
const getServer = require("../getServer");
const styleNumber = require("../styleNumber");

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
    
    options: ["server", "serverOptions"],

	async execute(client, interaction) {
        var guildId = await getServer(interaction);

        var { data } = await axios.get(
            config.url +
            `/api/guild/${guildId}/leaderboard?` +
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
        
        data = data.filter((obj) => obj[getSearch(type)] > 0).sort(function(a, b) { return b[getSearch(type)] - a[getSearch(type)] });

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
                    value: `${styleNumber(player[getSearch(type)])} ${getDisplay(type)} (${styleNumber(player[getSearch(type, true)])} ${getDisplay(type, false, true)})`,
                    inline: false
                });
            }

            const embed = new EmbedBuilder({fields: fields});

            embed.setColor(client.embedColor)
            embed.setTitle(`Highest ${getDisplay(type, true)} ${getDisplay(leaderboard)} Leaderboard`);

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
            return embed.setFooter({ text: `Page: ${index + 1}/${array.length}` }).setTimestamp();
        });
        pagination.render();
	},
};