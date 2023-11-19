const axios = require("axios");
const config = require("./config")();

const getServers = async () => {
    var { data } = await axios.get(config.url + "/api/guilds");
    return data;
}

module.exports = async () => {
    var data = [];

    for (const server of await getServers()) {
        data.push({ name: server.name, value: server.guildId });
    }
    
    return data;
}