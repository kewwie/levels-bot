const { 
	SlashCommandBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} = require('discord.js');
const config = require("../config")();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("Get info about the service"),
	
	guilds: [1154327161990295592], 

	async execute(client, interaction) {
		const embed = new EmbedBuilder()
			.setColor(client.embedColor)
			.setTitle(`About ${client.user.username}`)
			.addFields(
				{ name: "Developer", value: "<@292948682884775937>", inline: true },
				{ name: "Discord Latency", value: `${Math.round(client.ws.ping)}ms`, inline: true },
			)
			.setTimestamp();
	
		const button = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
			.setLabel("Support Server")
			.setStyle(ButtonStyle.Link)
			.setURL("https://discord.gg/xyjubXnX9T"),
		);
	
		await interaction.reply({
			embeds: [embed],
			components: [button],
		});
	},
};