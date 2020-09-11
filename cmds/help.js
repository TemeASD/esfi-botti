const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Help!',
    execute: async (bot, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setColor('#42d1f5')
            .setTitle('esfibot commands')
            .addField('!join', 'Lisää itsesi pelaajarosteriin')
            .addField('!out', 'Poista itsesi pelaajarosterista')
            .addField('!clear', 'Tyhjennä rosteri')
            .addField('!rosteri', 'Näytä pelaajarosteri' )
            .setFooter('(c) TemeASD#1134','','https://github.com/TemeASD/esfi-botti')
        message.channel.send(embed);
    }
}