require("dotenv").config();

module.exports = () => {
    if (!process.env.DISCORD_ID) {
        console.log("[BOT] Missing 'DISCORD_ID' in .env");
    }

    if (!process.env.DISCORD_TOKEN) {
        console.log("[BOT] Missing 'DISCORD_TOKEN' in .env");
    }

    if (!process.env.URL) {
        console.log("[BOT] Missing 'URL' in .env");
    }

    if (!process.env.API_KEY) {
        process.env.API_KEY = null;
    }

    return Object({
        discord: {
            id: process.env.DISCORD_ID,
            token: process.env.DISCORD_TOKEN
        },
        url: process.env.URL,
        api_key: process.env.API_KEY
    })
}