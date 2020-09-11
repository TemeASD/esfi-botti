const Discord = require('discord.js');
const fs = require('fs');
const gameName = "10man"
module.exports = {
    name: 'rosteri',
    description: 'Ketä on jonossa',
    execute: async (bot, message, args) => {
        try {
            if (!fs.existsSync(`./games/${gameName}.json`)) {
                fs.writeFileSync(`./games/${gameName}.json`, JSON.stringify({}));
            }
            fs.readFile(`./games/${gameName}.json`, (err, content) => {
                if (err) return console.error(err);
                let gamers = JSON.parse(content);

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Pelaajarosteri - ${Object.values(gamers).length}`)
                    .setColor('#ff5555')
                    .setDescription(Object.values(gamers).join('\n'));


                console.log(gamers)
                message.channel.send(embed);
                //if(Object.values(gamers).length = 10) {
                //    message.channel.send()
                //}
            });
        } catch (error) {
            console.error(error);
        }

    }
}