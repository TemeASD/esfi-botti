const Discord = require('discord.js');
const fs = require('fs');
const gameName = "10man"
module.exports = {
    name: 'clear',
    description: 'tyhjennä rosteri',
    execute: async (bot, message, args) => {
        try {
            fs.writeFile(`./games/${gameName}.json`, JSON.stringify({}), err => {
                if (err) return console.error(err);
                message.channel.send(`Rosteri tyhjennetty`);
            });

        } catch (error) {
            console.error(error);
        }

    }
}