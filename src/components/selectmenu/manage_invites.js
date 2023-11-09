const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const row1 = require("../buttons/vanity_getlink.js").data
const row3 =require("../buttons/vanity_deletelink.js").data

module.exports = {
    data: new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('manage_invites')
                .setPlaceholder('Select a vanity invite')
                .addOptions(
                    {
                        label: 'Select me',
                        description: 'This is a description',
                        value: 'first_option',
                    },
                    {
                        label: 'You can select me too',
                        description: 'This is also a description',
                        value: 'second_option',
                    },
                ),
        ),
    async execute(interaction) {
        await interaction.update({ content: 'Something was selected!', components: [row1, row3]});
    }
}
