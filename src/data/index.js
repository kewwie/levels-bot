const knex = require('knex')({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: "./db/data.sqlite"
    }
});

class Database {
    static async createTables() {
        await knex.schema.hasTable("servers").then(async (exists) => {
            if (!exists) {
                await knex.schema.createTable("servers", function (table) {
                    table.string("guildId").notNullable().unique();
                    table.string("server").notNullable();
                });
                console.log("[DATABASE] Created Table 'servers'");
            }
        });

        await knex.schema.hasTable("channels").then(async (exists) => {
            if (!exists) {
                await knex.schema.createTable("channels", function (table) {
                    table.string("guildId").notNullable();
                    table.string("channelId").notNullable().unique();
                    table.string("server").notNullable();
                });
                console.log("[DATABASE] Created Table 'channels'");
            }
        });

        await knex.schema.hasTable("users").then(async (exists) => {
            if (!exists) {
                await knex.schema.createTable("users", function (table) {
                    table.string("guildId").notNullable();
                    table.string("userId").notNullable().unique();
                    table.string("server").notNullable();
                });
                console.log("[DATABASE] Created Table 'users'");
            }
        });

        await knex.schema.hasTable("goals").then(async (exists) => {
            if (!exists) {
                await knex.schema.createTable("goals", function (table) {
                    table.string("guildId").notNullable();
                    table.string("userId").notNullable().unique();
                    table.string("goal").notNullable();
                });
                console.log("[DATABASE] Created Table 'goals'");
            }
        });
    }

    static async checkTables() {
        if (!await knex.schema.hasTable("servers")) {return await this.createTables()};
        if (!await knex.schema.hasTable("channels")) {return await this.createTables()};
        if (!await knex.schema.hasTable("users")) {return await this.createTables()};
        if (!await knex.schema.hasTable("goals")) {return await this.createTables()};
    }

    static async getServerDefault(guildId) {
        await this.checkTables();
        var data = await knex("servers")
            .where("guildId", guildId);
        
        if (data.length <= 0) {
            data = null;
        }
        
        return data;
    }

    static async getChannelDefault(guildId, channelId) {
        await this.checkTables();
        var data = await knex("channels")
            .where("guildId", guildId)
            .where("channelId", channelId);
        
        if (data.length <= 0) {
            data = null;
        }
        
        return data;
    }

    static async getUserDefault(guildId, userId) {
        await this.checkTables();
        var data = await knex("users")
            .where("guildId", guildId)
            .where("userId", userId);
        
        if (data.length <= 0) {
            data = null;
        }
        
        return data;
    }

    static async setServerDefault(guildId, server) {
        await this.checkTables();

        var data = await knex("servers")
            .where("guildId", guildId);
        
        if (data.length <= 0) {
            data = null;
        }

        var newData = {
            guildId: guildId,
            server: server
        }

        if (!data) {
            await knex("servers")
                .insert(newData);
        } else {
            await knex("servers")
                .where("guildId", guildId)
                .update(newData);
        }
    }
    
    static async setChannelDefault(guildId, channelId, server) {
        await this.checkTables();

        var data = await knex("channels")
            .where("guildId", guildId)
            .where("channelId", channelId);
        
        if (data.length <= 0) {
            data = null;
        }

        var newData = {
            guildId: guildId,
            channelId: channelId,
            server: server
        }

        if (!data) {
            await knex("channels")
                .insert(newData);
        } else {
            await knex("channels")
                .where("guildId", guildId)
                .where("channelId", channelId)
                .update(newData);
        }
    }

    static async setUserDefault(guildId, userId, server) {
        await this.checkTables();

        var data = await knex("users")
            .where("guildId", guildId)
            .where("userId", userId);
        
        if (data.length <= 0) {
            data = null;
        }

        var newData = {
            guildId: guildId,
            userId: userId,
            server: server
        }

        if (!data) {
            await knex("users")
                .insert(newData);
        } else {
            await knex("users")
                .where("guildId", guildId)
                .where("userId", userId)
                .update(newData);
        }
    }
}

module.exports = Database;