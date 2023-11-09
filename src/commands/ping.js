const {
	SlashCommandBuilder,
	ActionRowBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Displays the clients latency"),
		
	async execute(client, interaction) {
		const pingembed = new EmbedBuilder()
	
			.setColor("#5865f4")
			.addFields({
			name: "**Api** latency",
			value: `> **${Math.round(client.ws.ping)}ms**`,
			inline: false,
			})
			.setTimestamp();
	
		const button = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
			.setLabel("Discord Ping")
			.setStyle(ButtonStyle.Link)
			.setURL("https://discordstatus.com/"),
		);
	
		await interaction.reply({
			embeds: [pingembed],
			components: [button],
		});
	},
};