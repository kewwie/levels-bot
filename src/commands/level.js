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
		.setName("level")
		.setDescription("Get stats about a level")
		.addStringOption(option =>
			option.setName("level")
			.setDescription("A level")
			.setRequired(true)
	    )
        .addUserOption(option =>
			option.setName("user")
			.setDescription("Select the user you want to view")
			.setRequired(false)
	    ),
	
	options: ["server", "serverOptions"],

	async execute(client, interaction) {
		var guildId = await getServer(interaction);

        var user;

		if (!interaction.options.getUser("user")) {
			user = interaction.user.id;
		} else {
			user = interaction.options.getUser("user").id;
		}

        var { data } = await axios.get(config.url + `/api/guild/${guildId}/user/` + user)

        if (!data) {
            await interaction.reply({content: "This user doesn't have any stats", ephemeral: true});
            return;
        }

        var wantedLevel = interaction.options.getString("level");

        if (data.level >= wantedLevel) {
            await interaction.reply({content: "The user already have achived this level", ephemeral: true});
            return;
        }

        var totalXpNeeded = (await axios.get(
            config.url + `/api/level?` + new URLSearchParams({ level: Number(wantedLevel) })
        )).data.totalXp; 

        var embed = new EmbedBuilder()
            .setColor(client.embedColor)
            .setAuthor({ name: data.tag, iconURL: data.avatarUrl })
            .addFields(
                { name: "Level", value: `${wantedLevel}`, inline: false },
                { name: "Xp to Level " + wantedLevel, value: `${styleNumber(totalXpNeeded - data.totalXp)}`, inline: false },
                { name: "Messages to Level " + wantedLevel, value: `${styleNumber((totalXpNeeded - data.totalXp) / data.averageXp)} (${styleNumber((totalXpNeeded - data.totalXp) / data.averageXp)} Minutes)`, inline: false },
            )
            .setTimestamp()

        await interaction.reply({embeds: [embed], ephemeral: false});
    }
}