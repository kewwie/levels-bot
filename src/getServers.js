const axios = require("axios");
const config = require("./config")();

module.exports = async () => {
    var { data } = await axios.get(config.url + "/api/guilds");
    return data;
}