const Discord = require('discord.js');
const fs = require('fs');
const gameName = "10man"
module.exports = {
    name: 'join',
    description: 'Lisää itsesi pelaajarosteriin',
    execute: async (bot, message, args) => {
        try {
                if (!fs.existsSync(`./games/${gameName}.json`)) {
                    fs.writeFileSync(`./games/${gameName}.json`, JSON.stringify({}));
                } 
                fs.readFile(`./games/${gameName}.json`, (err, content) => {
                    if (err) return console.error(err);
                    let gamers = JSON.parse(content);

                    if (Object.keys(gamers).indexOf(message.author.id) > -1) return message.channel.send(`Olet jo rosterissa.`);
                    gamers[message.author.id] = (!message.member.nickname) ? message.author.username : message.member.nickname;

                    fs.writeFile(`./games/${gameName}.json`, JSON.stringify(gamers, null, '\t'), err => {
                        if (err) return console.error(err);
                    });

                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Pelaajarosteri - ${Object.values(gamers).length}`)
                        .setColor('#ff5555')
                        .setDescription(Object.values(gamers).join('\n'));
                    message.channel.send(`Olet nyt rosterissa.`, { embed: embed });
                });
        } catch (error) {
            console.error(error);
        }

    }
}