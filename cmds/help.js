const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Help!',
    execute: async (bot, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setColor('#42d1f5')
            .setTitle('esfibot komennot')
            .addFields(
                {name: '!join', value: 'Lisää itsesi pelaajarosteriin', inline: true },
                {name: '!out', value:'Poista itsesi pelaajarosterista', inline: true },
                {name: '!clear', value:'Tyhjennä rosteri', inline: true },
                {name: '!rosteri', value:'Näytä pelaajarosteri', inline: true } 
                )
            .addField('SCRIMS', ' ')
            .addFields( 
                {name: '!scrim start map', value: 'Käynnistää palvelimen', inline: true},
                {name: '!scrim end',  value:'Lopettaa pelin ja sammuttaa palvelimen', inline: true}, 
                {name: '!scrim clear',  value:'Tyhjentää joukkueet', inline: true},
                {name: '!scrim team1/team2',  value: 'Asettaa viestin lähettäneen pelaajan haluttuun joukkueeseen', inline: true},
                {name: '!scrim team1/team2 @pelaaja',  value: 'Asettaa tägätyn pelaajan haluttuun joukkueeseen' , inline: true})
            .setFooter('(c) TemeASD#1134','','https://github.com/TemeASD/esfi-botti')
        message.channel.send(embed);
    }
}