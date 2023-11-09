const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new ButtonBuilder()
        .setCustomId("vanity_deletelink")
        .setLabel("Delete")
        .setStyle(ButtonStyle.Danger),
    async execute(interaction) {
        await interaction.reply("Confirm Delete");
    }
}