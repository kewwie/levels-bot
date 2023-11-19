const getServers = require("./getServers");

module.exports = async (interaction) => {
    var guildId;

    if (interaction.options.getString("server")) {
        guildId = interaction.options.getString("server");
    } else {
        if ((await getServers()).some(obj => obj.guildId === interaction.guild.id)) {
            guildId = interaction.guild.id;
        } else {
            guildId = interaction.client.defaultServer;
        }
    }

    return guildId;
}