const Discord = require('discord.js');
const fs = require('fs');
const gameName = "10man"
module.exports = {
    name: 'out',
    description: 'Poista itsesi pelaajarosterista',
    execute: async (bot, message, args) => {
        try {
                if (!fs.existsSync(`./games/rosteri.json`)) {
                    fs.writeFileSync(`./games/rosteri.json`, JSON.stringify({}))
                }
                fs.readFile(`./games/rosteri.json`, (err, content) => {
                    if (err) return console.error(err);
                    let gamers = JSON.parse(content);

                    if (Object.keys(gamers).indexOf(message.author.id) === -1) return message.channel.send(`Et ole ollutkaan rosterissa.`);
                    delete gamers[message.author.id];

                    fs.writeFile(`./games/rosteri.json`, JSON.stringify(gamers, null, '\t'), err => {
                        if (err) console.error(err);
                    });

                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Pelaajarosteri - ${Object.values(gamers).length}`)
                        .setColor('#ff5555')
                        .setDescription(Object.values(gamers).join('\n'));
                    message.channel.send(`Olet hyljännyt ystäväsi.`, { embed: embed });
                });

        } catch (error) {
            console.error(error);
        }

    }
}