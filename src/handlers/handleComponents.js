const { readdirSync } = require("node:fs")

module.exports = (client) => {
    client.handleComponents = async () => {
        const componentsFolders = readdirSync("./src/components");
        for (const folder of componentsFolders) {
            const componentFiles = readdirSync(`./src/components`).filter((file) => file.endsWith(".js"));

            switch (folder) {
                case "buttons":
                    for (const file of componentFiles) {
                        const button = require(`../components/${folder}/${file}`);
                        //console.log(button.data)
                        //console.log(button.data.ButtonBuilder.customId)
                        //console.log(button.data.ButtonBuilder.custom_id)
                        // cant find the custom id in data
                    
                        client.buttons.set(button.data.custom_id, button);
                    }
                    break;

                default:
                    break;
            }
        }
    } 
}