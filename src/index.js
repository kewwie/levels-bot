const { Client, GatewayIntentBits, Collection, ActivityType } = require("discord.js");
const { readdirSync } = require("node:fs")

const config = require("./config")();

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    presence: {
        status: 'online',
        activities: [
            { name: 'Thank you so much for creating me Kewi!', type: ActivityType.Custom }
        ]
    },
});
            
try {
    client.embedColor = "#5865f4";
    client.errColor = "#eb4034";
    client.defaultServer = "217055651371679745";

    client.commands = new Collection();
    client.commandList = [];

    client.buttons = new Collection();
    client.events = new Collection();
    

    const handleFiles = readdirSync(`./src/handlers`).filter((file) => file.endsWith(".js"));
    for (const file of handleFiles) {
        require(`./handlers/${file}`)(client);
    }

    client.handleCommands();
    client.handleComponents();
    client.handleEvents();
    client.login(config.discord.token);
} catch (error) {
    console.log(error);
}