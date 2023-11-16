const { InteractionType } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
        
            try {
                await command.execute(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ 
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }

        } else if (interaction.isButton()) {
            return;
            /*const button = interaction.client.buttons.get(interaction.customId);
            if (!button) return console.error(`There is no code for this button\n${interaction.customId}`);

            try {
                await button.execute(client, interaction);
            } catch (err) {
                console.log(err);
            }*/
        } else if (interaction.isSelectMenu()) {
            return;
            const SelectMenuPath = path.join(__dirname, 'components/SelectMenu');
            for (const file of fs.readdirSync(SelectMenuPath).filter(file => file.endsWith('.js'))) {
                if (file.replace(".js", "") === interaction.component.customId) {
                    require(path.join(SelectMenuPath, file)).execute(interaction);
                }
            }
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete(client, interaction);
            } catch (err) {
                console.error(err);
            }
        }
    }
}