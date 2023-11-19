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

    if (process.env.STATUS !== "DEV") {
        process.env.STATUS = "PROD";
    }

    if (!process.env.TEST_SERVER) {
        process.env.TEST_SERVER = null;
    }

    return Object({
        discord: {
            id: process.env.DISCORD_ID,
            token: process.env.DISCORD_TOKEN
        },
        url: process.env.URL,
        api_key: process.env.API_KEY,
        status: process.env.STATUS,
        testServer: process.env.TEST_SERVER,
        embedLength: "               \u200B",
    })
}