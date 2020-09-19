const Discord = require('discord.js');
const fs = require('fs');
const { CSGO_PATH, CSGO_srv_token } = require('../config.json');
const { exec } = require('child_process');
let connect = ''
function connectString() {
    exec('curl bot.whatismyipaddress.com', (err, stdout, stderr) => {
        if (err) {
            connect = `lol joku meni vikaan :D`;
        } else {
            connect = `connect ${stdout}:27015;password esfipw`;
            return
        }
    });
}
class Roster {
    constructor(players) {
        this.player1 = players[0];
        this.player2 = players[1];
        this.player3 = players[2];
        this.player4 = players[3];
        this.player5 = players[4];
        this.config =
            `"Match"
{
    "scrim" "1"
    "side_type" "always_knife"
    "players_per_team"  "5"
    "num_maps"  "1"
    "skip_veto" "1"
    "team1"
    {
        "name"  "Home"
        "players"
        {
            "${this.player1}"    ""
            "${this.player2}"    ""
            "${this.player3}"    ""
            "${this.player4}"    ""
            "${this.player5}"    ""
        }
    }
    "cvars"
    {
        "get5_live_countdown_time"  "5"
        "mp_halftime_duration"  "15"
        "mp_match_can_clinch"   "1"
        "mp_overtime_enable"    "1"
        "mp_match_restart_delay"    "15"
        "get5_max_pause_time"   "180"
        "get5_check_auths"  "1"
        "get5_demo_name_format" "ESFI_scrim{TIME}_{MAPNAME}"
        "get5_kick_when_no_match_loaded"    "0"
        "get5_print_damage" "1"
    }
}`
    }
}
/*
To show the players in the messages their names are stored here
That is done in case of insufficient privileges 
scrim.json and these arrays *WILL* desync in case of bot crash

TODO: fix :D
*/
let team1 = []
let team2 = []
module.exports = {
    name: 'scrim',
    description: 'Assign yourself to a team then start a server to jump right in',
    execute: async (bot, message, args, child) => {
        if (!args.length) {
            fs.readFile('./games/scrim.json', (err, content) => {
                if (err) return console.error(err);
                const embed = new Discord.MessageEmbed().setTitle('5v5 Scrim Roster').setColor('#ff5555')
                    .addField(`Tiimi 1 - ${team1.length}`, team1.join('\n') || 'empty', true)
                    .addField(`Tiimi 2 - ${team2.length}`, team2.join('\n') || 'empty', true);

                message.channel.send(embed);
            });
        }
        if (args[0] === 'help') return bot.commands.get('help').execute(bot, message, args, child);
        fs.readFile('./games/steamid.json', (err, content) => {
            if (err) return console.error(err);
            const steamIDs = JSON.parse(content);
            if (Object.keys(steamIDs).indexOf(message.author.id) === -1) return message.channel.send(`Steam ID:tä ei löytynyt "tietokannasta(:D)" käytä \`!steamid\` komentoa.`);
        });

        /*Assigning captain to a team 1 */
        if (args[0] === 'captain' && args[1] === 'team1') {
            if (team1.length === 0) {
                addToTeam(args[1], message.author.id, message.author.username, message)
            } else {
                return message.channel.send('Tiimissä on jo kapteeni')
            }
        }
        /*Assigning captain to a team 2 */
        if (args[0] === 'captain' && args[1] === 'team2') {
            if (team2.length === 0) {
                addToTeam(args[1], message.author.id, message.author.username, message)
            } else {
                return message.channel.send('Tiimissä on jo kapteeni')
            }
        }
        if (args[0] === 'team1' || args[0] === 'team2') {
            /*had second argument, but not mentioned any other user, not doing shit*/
            if (args[1] && message.mentions.users.size === 0) {
                return message.channel.send('Tägää joku pelaaja. Jos haluat lisätä itsesi tiimiin, älä laita muuta kuin `!scrim teamN`')
            }
            
            /*had second argument, other user mentioned, adding to roster*/
            if (!args[1] && message.mentions.users.size === 1) {
                let mentionedUser = Array.from(message.mentions.users.values())[0];
                addToTeam(args[0], mentionedUser.id, mentionedUser.username, message);
            }
            /*no arguments, adding self to the wanted team*/
            if (!args[1]) {
                addToTeam(args[0], message.author.id, message.author.username, message)
            }
        }


        if (args[0] === 'end') {
            child.stdin.write(`quit\n`);
            message.channel.send('Serveri sammuu....');
            const roster = {
                "team1": {},
                "team2": {}
            };
            fs.writeFile('./games/scrim.json', JSON.stringify(roster, null, '\t'), err => {
                if (err) return console.error(err);
                message.channel.send('Scrimin rosteri tyhjennetty.');
            });
        }
        /* move to separate function/command*/
        if (args[0] === 'start') {
            /*validation from arguments*/
            if (!args[1]) return message.channel.send('Anna mappi, esim "de_dust2"');
            const maps = ["de_nuke", "de_dust2", "de_vertigo", "de_inferno", "de_overpass", "de_train", "de_mirage", "de_anubis", "de_cbble"]
            if (!maps.includes(args[1])) return message.channel.send(`Validit kartat: ${maps.toString()} `);

            /*if succeeded lets read the ready scrim json and do some validation*/
            fs.readFile('./games/scrim.json', (err, content) => {
                if (err) return console.error(err);
                const roster = JSON.parse(content);
                if (Object.values(roster.team1).length != 5 && Object.values(roster.team2).length != 5) return message.channel.send('Joukkeissa ei tarpeeksi pelaajia.');
                if (!Object.keys(roster.team1).includes(message.author.id) && !Object.keys(roster.team2).includes(message.author.id)) return message.channel.send('Et ole rosterissa, haista paska :D');

                /*validation succeeded, lets load the the team 1 and write scrim template*/
                /*get5 scrims only want "team1", no need to worry about team2 anyone else*/
                const rosterArray = Object.values(roster.team1);
                const scrimRoster = new Roster(rosterArray);
                startServer(scrimRoster, args[1], message, child, bot);
            });
        }

        if (args[0] === 'clear') {
            clearRoster(message);
            clearTeams();
        }
        if (args[0] === 'test') {
            if (message.author.id != '183934154558275584') return;
            const rosterArray = ['STEAM_0:1:11898431', 'STEAM_0:0:54543754', 'STEAM_1:1:.....', 'STEAM_1:1:.....', 'STEAM_1:1:.....'];
            const testRoster = new Roster(rosterArray);
            startServer(testRoster, args[1], message, child, bot);
        }

    }
}
/**
* Starts the server. 
* @param scrimRoster {object} object of scrimRoster class
* @param map {string}, map to be played
* @param message {object} discordjs message class object 
* @param bot {object} discordjs bot class object
* @param child {objec} sh instance
*/
function startServer(scrimRoster, map, message, bot, child) {
    fs.writeFile(`${CSGO_PATH}/csgo/addons/sourcemod/configs/get5/scrim_template.cfg`, scrimRoster.config, async err => {
        if (err) { return console.error(err) };
        child.stdin.write(`./srcds_run -game csgo -tickrate 128 -net_port_try 1 -console -usercon +game_type 0 +game_mode 1 +map ${map} +maxplayers 12 +sv_setsteamaccount ${CSGO_srv_token}\n`);
        const msg = await message.channel.send('Sierra hyrskyttää...');
        connectString()
        bot.setTimeout(() => {
            msg.edit(`\`${connect}\``);
        }, 10000);
    });
}

function clearRoster(message) {
    const roster = {
        "team1": {},
        "team2": {}
    };
    fs.writeFile('./games/scrim.json', JSON.stringify(roster, null, '\t'), err => {
        if (err) return console.error(err);
        message.channel.send('Scrimin rosteri tyhjennetty.');
    });
}

function clearTeams() {
    team1 = [];
    team2 = [];
}
/**
* team should be either "team1" or "team2"
* @param team {string} team, "team1" or "team2"
* @param mentionedUserId {discordUserId}, user id of the discord user
* @param mentionedUserName {string}, username that matches that string
* @param message {object} discord message class object 
*/
function addToTeam(team, mentionedUserId, mentionedUserName, message) {
    fs.readFile('./games/scrim.json', async (err, content) => {
        let roster = JSON.parse(content);
        if (err) return console.error(err);
        delete roster[team][mentionedUserId];
        fs.readFile('./games/steamid.json', (err, content) => {
            if (err) return console.error(err);
            const steamid = JSON.parse(content);
            const discordid = mentionedUserId;
            roster[team][discordid] = steamid[discordid];
            fs.writeFile('./games/scrim.json', JSON.stringify(roster, null, '\t'), err => {
                if (err) return console.error(err);
                /*Shit code to show the teams on "frontend" */
                team1 = team1.filter(name => { return name != mentionedUserName })
                team2 = team2.filter(name => { return name != mentionedUserName })
                if (team === 'team1') { team1.push(mentionedUserName) }
                if (team === 'team2') { team2.push(mentionedUserName) }
                const embed = new Discord.MessageEmbed().setTitle('5v5 Scrim Roster').setColor('#ff5555')
                    .addField(`Tiimi 1 - ${team1.length}`, team1.join('\n') || 'empty', true)
                    .addField(`Tiimi 2 - ${team2.length}`, team2.join('\n') || 'empty', true);
                message.channel.send(embed);
            });
        });
    });
}
