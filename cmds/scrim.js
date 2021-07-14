const Discord = require('discord.js');
const fs = require('fs');
const { CSGO_PATH, CSGO_srv_token } = require('../config.json');
const { exec } = require('child_process');
<<<<<<< HEAD
<<<<<<< HEAD
const util = require('util');
let connect = ''
=======
>>>>>>> parent of f0a77b9... quite a bad commit

function connectString() {
    exec('curl bot.whatismyipaddress.com', (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err)
            return `lol joku meni vikaan :D`;
        } else {
<<<<<<< HEAD
            connect = `connect ${stdout}:27015;password a_super_sekrit_pw`;
=======
let connect = ''
function connectString() {
    exec('curl bot.whatismyipaddress.com', (err, stdout, stderr) => {
        if (err) {
            connect = `lol joku meni vikaan :D`;
        } else {
            connect = `connect ${stdout}:27015;password esfipw`;
>>>>>>> 059253eba7ffb067c453b200ad87d475cf544b05
            return
=======
            // the *entire* stdout and stderr (buffered)
            return `connect ${stdout}:27005`;
>>>>>>> parent of f0a77b9... quite a bad commit
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

module.exports = {
    name: 'scrim',
    description: 'Assign yourself to a team then start a server to jump right in',
    execute: async (bot, message, args, child) => {
<<<<<<< HEAD
<<<<<<< HEAD
        if (args[0] === 'help') {
            const embed = new Discord.MessageEmbed()
                .setColor('#42d1f5')
                .setTitle('Gandhi scrim ')
                .addField('SCRIMS', 'Help here')
                .addFields(
                    { name: '!scrim-steamid', value: 'Add your SteamID to the service, you need it', inline: true },
                    { name: '!scrim start [map]', value: 'Starts the server with selected map', inline: true },
                    { name: '!scrim end', value: 'Stops the game, shuts down the server', inline: true },
                    { name: '!scrim clear', value: 'Clears the teams', inline: true },
                    { name: '!scrim map add [url]', value: 'Adds a Steam Workshop map to the scrims', inline: true },
                    { name: '!scrim map list', value: 'Lists the maps', inline: true },
                    { name: '!scrim map remove [map_name]', value: 'Removes map from the scrims', inline: true },
                    { name: '!scrim team1/team2', value: 'Sets the player whom sent the message to a team', inline: true },
                    { name: '!scrim team1/team2 @[user]', value: 'Sets tagged player to a chosen team', inline: true })
                .setFooter('(c) TemeASD#1134', '', 'https://github.com/TemeASD/esfi-botti')
            return message.channel.send(embed);

        }
=======
>>>>>>> parent of f0a77b9... quite a bad commit
        if (!args.length) {
            fs.readFile('./games/scrim.json', (err, content) => {
                if (err) return console.error(err);
                const roster = JSON.parse(content);
                let team1 = [];
                let team2 = [];

                for (const i of Object.keys(roster.team1)) {
                    const name = (!bot.guilds.cache.first().members.cache.get(i).nickname) ? bot.guilds.cache.first().members.cache.get(i).user.username : bot.guilds.cache.first().members.cache.get(i).nickname;
                    team1.push(name);
                }
                for (const i of Object.keys(roster.team2)) {
                    const name = (!bot.guilds.cache.first().members.cache.get(i).nickname) ? bot.guilds.cache.first().members.cache.get(i).user.username : bot.guilds.cache.first().members.cache.get(i).nickname;
                    team2.push(name);
                }

                const embed = new Discord.MessageEmbed().setTitle('5v5 Scrim Roster').setColor('#ff5555')
                    .addField(`Team 1 - ${team1.length}`, team1.join('\n') || 'empty', true)
                    .addField(`Team 2 - ${team2.length}`, team2.join('\n') || 'empty', true);

                message.channel.send(embed);
            });
        }

        if (args[0] === 'help') return bot.commands.get('help').execute(bot, message, args, child);
        fs.readFile('./games/steamid.json', (err, content) => {
            if (err) return console.error(err);
            const steamIDs = JSON.parse(content);
<<<<<<< HEAD
            if (Object.keys(steamIDs).indexOf(message.author.id) === -1) return message.channel.send(`Steam ID wasn't found, please use !steamid command.`);
=======
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
>>>>>>> 059253eba7ffb067c453b200ad87d475cf544b05
=======

            if (Object.keys(steamIDs).indexOf(message.author.id) === -1) return message.channel.send(`Your Steam ID is not in the database yet. Add your ID using the \`!steamid\` command.`);
>>>>>>> parent of f0a77b9... quite a bad commit
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
<<<<<<< HEAD
            /*had second argument, but not mentioned any other user, not doing shit*/
<<<<<<< HEAD

            /*had second argument, other user mentioned, adding to roster*/
            if (args[1] && message.mentions.users.size === 1) {
                let mentionedUser = Array.from(message.mentions.users.values())[0];
                addToTeam(args[0], mentionedUser.id, mentionedUser.username, message, bot);
            }
            if (args[1] && message.mentions.users.size === 0) {
                return message.channel.send('Tag a player, or omit the argument if you only want yourself in the team`')
            }
            /*no arguments, adding self to the wanted team*/
            if (!args[1]) {
                addToTeam(args[0], message.author.id, message.author.username, message, bot)
=======
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
>>>>>>> 059253eba7ffb067c453b200ad87d475cf544b05
            }
=======
            fs.readFile('./games/scrim.json', async (err, content) => {
                if (err) return console.error(err);
                let roster = JSON.parse(content);

                delete roster['team1'][message.author.id];
                delete roster['team2'][message.author.id];

                fs.readFile('./games/steamid.json', (err, content) => {
                    if (err) return console.error(err);
                    const steamid = JSON.parse(content);
                    const discordid = message.author.id;

                    roster[args[0]][discordid] = steamid[discordid];
                    fs.writeFile('./games/scrim.json', JSON.stringify(roster, null, '\t'), err => {
                        if (err) return console.error(err);
                        let team1 = [];
                        let team2 = [];

                        for (const t of Object.keys(roster.team1)) {
                            const name = (!bot.guilds.cache.first().members.cache.get(t).nickname) ? bot.guilds.cache.first().members.cache.get(t).user.username : bot.guilds.cache.first().members.cache.get(t).nickname;
                            team1.push(name);
                        }
                        for (const t of Object.keys(roster.team2)) {
                            const name = (!bot.guilds.cache.first().members.cache.get(t).nickname) ? bot.guilds.cache.first().members.cache.get(t).user.username : bot.guilds.cache.first().members.cache.get(t).nickname;
                            team2.push(name);
                        }

                        const embed = new Discord.MessageEmbed().setTitle('5v5 Scrim Roster').setColor('#ff5555')
                            .addField(`Team 1 - ${team1.length}`, team1.join('\n') || 'empty', true)
                            .addField(`Team 2 - ${team2.length}`, team2.join('\n') || 'empty', true);
                        message.channel.send(embed);
                    });
                });
            });
>>>>>>> parent of f0a77b9... quite a bad commit
        }

        if (args[0] === 'clear') {
            const roster = {
                "team1": {},
                "team2": {}
            };
            fs.writeFile('./games/scrim.json', JSON.stringify(roster, null, '\t'), err => {
                if (err) return console.error(err);
                message.channel.send('Scrimin rosteri tyhjennetty.');
            });
        }

        if (args[0] === 'end') {
            child.stdin.write(`quit\n`);
<<<<<<< HEAD
<<<<<<< HEAD
            clearRoster(message);
            clearTeams();
=======
            message.channel.send('Server shutting down.');
            const roster = {
                "team1": {},
                "team2": {}
            };
            fs.writeFile('./games/scrim.json', JSON.stringify(roster, null, '\t'), err => {
                if (err) return console.error(err);
                message.channel.send('Scrimin rosteri tyhjennetty.');
            });
>>>>>>> parent of f0a77b9... quite a bad commit
        }

        if (args[0] === 'start') {
<<<<<<< HEAD
            /*Validation, and selecting the correct map from the JSON, _or_ a random map*/
            if (!args[1]) return message.channel.send('Gimme a map, for example "de_dust2"');
            fs.readFile('./games/maps.json', (err, content) => {
                if (err) return console.error(err);
                const maps = JSON.parse(content);
                if (!nameDoesNotExist(args[1], maps)) return message.channel.send(`Accepted maps: ${maps.map(map => map.name).join(", ")}`);
                if (args[1] === 'random') { args[1] = maps[Math.floor(Math.random() * maps.length)].name; }
                message.channel.send(`You've selected random map, it is: ${args[1]} and there are no re-rolls here cap!`)
                args[1] = getSingleMap(args[1], maps)
                
            })
=======
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
>>>>>>> 059253eba7ffb067c453b200ad87d475cf544b05
=======
            if (!args[1]) return message.channel.send('Anna mappi, esim "de_dust2"');

            // check for correct map name
            const mapFiles = (await fs.promises.readdir(`${CSGO_PATH}/csgo/maps`)).filter(file => file.endsWith('.bsp'));
            const maps = [];
            for (const m of mapFiles) {
                const map = m.slice(0, -4);
                maps.push(map);
            }
            if (!maps.includes(args[1])) return message.channel.send('Ei karttaa tuolla nimellä');
>>>>>>> parent of f0a77b9... quite a bad commit

            fs.readFile('./games/scrim.json', (err, content) => {
                if (err) return console.error(err);
                const roster = JSON.parse(content);
<<<<<<< HEAD
<<<<<<< HEAD
                if (Object.values(roster.team1).length != 5 && Object.values(roster.team2).length != 5) return message.channel.send('Not enough players.');
                if (!Object.keys(roster.team1).includes(message.author.id) && !Object.keys(roster.team2).includes(message.author.id)) return message.channel.send('You are not on the roster');
=======
                if (Object.values(roster.team1).length != 5 && Object.values(roster.team2).length != 5) return message.channel.send('Joukkeissa ei tarpeeksi pelaajia.');
                if (!Object.keys(roster.team1).includes(message.author.id) && !Object.keys(roster.team2).includes(message.author.id)) return message.channel.send('Et ole rosterissa, haista paska :D');
>>>>>>> 059253eba7ffb067c453b200ad87d475cf544b05
=======
                if (Object.values(roster.team1).length != 5 && Object.values(roster.team2).length != 5) return message.channel.send('Not enough players for a scrim.');
                if (!Object.keys(roster.team1).includes(message.author.id) && !Object.keys(roster.team2).includes(message.author.id)) return message.channel.send('You are not on the scrim roster. Sod off.');
>>>>>>> parent of f0a77b9... quite a bad commit

                const rosterArray = Object.values(roster.team1);
                const scrimRoster = new Roster(rosterArray);
<<<<<<< HEAD
<<<<<<< HEAD
                startServer(scrimRoster, args[1], message, bot, child);

=======
                startServer(scrimRoster, args[1], message, child, bot);
>>>>>>> 059253eba7ffb067c453b200ad87d475cf544b05
=======

                fs.writeFile(`${CSGO_PATH}/csgo/addons/sourcemod/configs/get5/scrim_template.cfg`, scrimRoster.config, async err => {
                    if (err) return console.error(err);
                    child.stdin.write(`./srcds_run -game csgo -tickrate 128 -net_port_try 1 -console -usercon +game_type 0 +game_mode 1 +map ${args[1]} +maxplayers 12 +sv_setsteamaccount ${CSGO_srv_token}\n`);
                    const msg = await message.channel.send('Sierra hyrskyttää...');
                    let connect = connectString();
                    bot.setTimeout(() => {
                        msg.edit(`\`${connect}\``);
                    }, 20000);
                });
>>>>>>> parent of f0a77b9... quite a bad commit
            });
        }

        if (args[0] === 'test') {
            if (message.author.id != '183934154558275584') return;
<<<<<<< HEAD
<<<<<<< HEAD
            const rosterArray = ['STEAM_0:1:11898431', 'STEAM_0:0:29814953', 'STEAM_1:1:.....', 'STEAM_1:1:.....', 'STEAM_1:1:.....'];
            const testRoster = new Roster(rosterArray);
            if (!args[1]) return message.channel.send('Gimme a map, for example "de_dust2"');
            fs.readFile('./games/maps.json', (err, content) => {
                if (err) return console.error(err);
                const maps = JSON.parse(content);
                if (!nameDoesNotExist(args[1], maps)) return message.channel.send(`Accepted maps: ${maps.map(map => map.name).join(", ")}`);
                //select a random map
                
                args[1] = getSingleMap(args[1], maps)
                console.log('Random map is:', args[1].name)
                startServer(testRoster, args[1], message, bot, child);
            })
            /*if succeeded lets read the ready scrim json and do some validation*/
        }
        if (args[0] === 'map') {
            if (args[1] === 'add') {
                if (args[2]) {
                    mapObj = {
                        name: "",
                        pool: "workshop",
                        url: "",
                        id: ""
                    }
                    try {
                        workshopURL = new URL(args[2])
                    } catch (error) {
                        return message.channel.send(`${error.code} Match this format <https://steamcommunity.com/sharedfiles/filedetails/?id=2484335179>`)
                    }
                    workshopID = workshopURL.searchParams.get('id');
                    let maps = fs.readFileSync('./games/maps.json')
                    maps = JSON.parse(maps)
                    if (workshopURL.hostname.toLowerCase() !== 'steamcommunity.com') return message.channel.send("URL doesn't point to steamcommunnity.com, match this format <https://steamcommunity.com/sharedfiles/filedetails/?id=2484335179>")
                    if (!workshopID) return message.channel.send("No params, match this format <https://steamcommunity.com/sharedfiles/filedetails/?id=2484335179>")
                    if (idDoesNotExist(workshopID, maps)) return message.channel.send("The map is already on the list")
                    message.channel.send("Adding the map most likely succeeded!")
                    getWorkshopDataFromSteam(workshopID, maps, bot, message)
                }
            }
            if (args[1] === 'list') {
                fs.readFile('./games/maps.json', (err, content) => {
                    if (err) return console.error(err);
                    const maps = JSON.parse(content);
                    const embed = new Discord.MessageEmbed()
                        .setColor('#42d1f5')
                        .setTitle('Gandhi scrim ')
                        .addField('SCRIMS', 'map list')
                        .setFooter('(c) TemeASD#1134', '', 'https://github.com/TemeASD/esfi-botti')
                    maps.forEach(map => {
                        if (map.url === '') map.url = 'Default content';
                        embed.addField(map.name, map.url)
                    })
                    return message.channel.send(embed);

                })
            }
            if (args[1] === 'remove') {
                fs.readFile('./games/maps.json', (err, content) => {
                    if (err) return console.error(err);
                    const maps = JSON.parse(content);
                    const mapToDelete = args[2];
                    const newMaps = maps.filter(map => {
                        return (map.name.toLowerCase() !== mapToDelete.toLowerCase()) || (map.pool === 'competitive')
                    })
                    if (util.isDeepStrictEqual(maps, newMaps)) return message.channel.send(`Map not deleted. This might be because of a typo, or the map cant be deleted (default content) or it doesn't exist at all.`)
                    fs.writeFile('/home/csgosrv/esfi-botti/games/maps.json', JSON.stringify(newMaps, undefined, 4), async err => {
                        if (err) return console.error(err);
                        message.channel.send(`Map ${mapToDelete} deleted.`)

                    })
=======
>>>>>>> parent of f0a77b9... quite a bad commit

            const mapFiles = await fs.promises.readdir(`${CSGO_PATH}/csgo/maps`).filter(file => file.endsWith('.bsp'));
            const maps = [];
            for (const m of mapFiles) {
                const map = m.slice(0, -4);
                maps.push(map);
            }
            if (!maps.includes(args[1])) return message.channel.send('No map found with that name');

            const rosterArray = ['STEAM_0:1:11898431', 'STEAM_1:1:.....', 'STEAM_1:1:.....', 'STEAM_1:1:.....', 'STEAM_1:1:.....'];
            const testRoster = new Roster(rosterArray);

            fs.writeFile(`${CSGO_PATH}/csgo/addons/sourcemod/configs/get5/scrim_template.cfg`, testRoster.config, async err => {
                if (err) return console.error(err);
                child.stdin.write(`./srcds_run -debug -condebug -game csgo -tickrate 128 -net_port_try 1 -console -usercon +game_type 0 +game_mode 1 +map ${args[1]} +maxplayers 12\n  +sv_setsteamaccount ${CSGO_srv_token}`);
                const msg = await message.channel.send('Kolomen litran OoHooCee hyrskyttää');
                let connect = connectString();
                bot.setTimeout(() => {
                    msg.edit(`\`${connect}\``);
                }, 20000);
            });
        }

        if (args[0] === 'write') {
            fs.readFile('./games/scrim.json', (err, content) => {
                if (err) return console.error(err);
                const roster = JSON.parse(content);
                if (Object.values(roster.team1).length != 5 && Object.values(roster.team2).length != 5) return message.channel.send('Not enough players for a scrim.');
                if (!Object.keys(roster.team1).includes(message.author.id) && !Object.keys(roster.team2).includes(message.author.id)) return message.channel.send('You are not on the scrim roster. Sod off.');

                const rosterArray = Object.values(roster.team1);
                const scrimRoster = new Roster(rosterArray);

<<<<<<< HEAD
function sanitizeMapName(mapName) {
    let mapName2 = mapName.replace(/ /g, '-');
    mapName2 = mapName2.replace(/\(/g, '');
    mapName2 = mapName2.replace(/\)/g, '');
    mapName2 = mapName2.replace(/\|/g, '');
    mapName2 = mapName2.replace(/\[/g, '');
    mapName2 = mapName2.replace(/\]/g, '');
    return mapName2
}
=======
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
>>>>>>> 059253eba7ffb067c453b200ad87d475cf544b05
=======
                fs.writeFile(`${CSGO_PATH}/csgo/addons/sourcemod/configs/get5/scrim_template.cfg`, scrimRoster.config, async err => {
                    if (err) return console.error(err);
                    message.channel.send('Scrim roster written to server file. Tell Geary to run this command on the server `./srcds_run -game csgo -tickrate 128 -net_port_try 1 -console -usercon +game_type 0 +game_mode 1 +map [map name] +maxplayers 12`');
                });
            });
        }
    }
}
>>>>>>> parent of f0a77b9... quite a bad commit
