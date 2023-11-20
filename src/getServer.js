const getServers = require("./getServers");
const Data = require("./data");

module.exports = async (interaction) => {
    var guildId;

    if (interaction.options.getString("server")) {
        guildId = interaction.options.getString("server");
    } else {
        if ((await getServers()).some(obj => obj.guildId === interaction.guild.id)) {
            guildId = interaction.guild.id;
            
        } else if (await Data.getChannelDefault(interaction.guild.id, interaction.channel.id)) {
            guildId = (await Data.getChannelDefault(interaction.guild.id, interaction.channel.id))[0].server;

        } else if (await Data.getServerDefault(interaction.guild.id)) {
            guildId = (await Data.getServerDefault(interaction.guild.id))[0].server;

        } else if (await Data.getUserDefault(interaction.guild.id, interaction.user.id)) {
            guildId = (await Data.getUserDefault(interaction.guild.id, interaction.user.id))[0].server; 

        } else {
            guildId = interaction.client.defaultServer;
        }
    }

    return guildId;
}