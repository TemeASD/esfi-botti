const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'clear',
    description: 'tyhjennä rosteri',
    execute: async (bot, message, args) => {
        try {
            fs.writeFile(`./games/rosteri.json`, JSON.stringify({}), err => {
                if (err) return console.error(err);
                message.channel.send(`Rosteri tyhjennetty`);
            });

        } catch (error) {
            console.error(error);
        }

    }
}