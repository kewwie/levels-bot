const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ButtonBuilder()
        .setCustomId("vanity_getlink")
        .setLabel("Open Link")
        .setStyle(ButtonStyle.Primary),
    async execute(interaction) {
        await interaction.reply("[Click Here](http://disinv.xyz/discord)");
    }
}