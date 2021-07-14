const Discord = require('discord.js');
const fs = require('fs');
const http = require('http');
const { CSGO_PATH, CSGO_srv_token, steam_web_api_key } = require('../config.json');
const { exec } = require('child_process');
const util = require('util');
let connect = ''

function connectString() {
    exec('curl bot.whatismyipaddress.com', (err, stdout, stderr) => {
        if (err) {
            connect = `Somethink went wrong :D`;
        } else {
            connect = `connect ${stdout}:27015;password a_super_sekrit_pw`;
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
        "get5_demo_name_format" "Gandhi_scrim{TIME}_{MAPNAME}"
        "get5_kick_when_no_match_loaded"    "0"
        "get5_print_damage" "1"
        "tv_enable" "0"
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
        if (!args.length) {
            message.channel.send(scrimTeamsEmbed(team1, team2));
        }
        fs.readFile('./games/steamid.json', (err, content) => {
            if (err) return console.error(err);
            const steamIDs = JSON.parse(content);
            if (Object.keys(steamIDs).indexOf(message.author.id) === -1) return message.channel.send(`Steam ID wasn't found, please use !steamid command.`);
        });

        if (args[0] === 'team1' || args[0] === 'team2') {
            /*had second argument, but not mentioned any other user, not doing shit*/

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
            }
        }


        if (args[0] === 'end') {
            child.stdin.write(`quit\n`);
            clearRoster(message);
            clearTeams();
        }
        /* move to separate function/command*/
        if (args[0] === 'start') {
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

            /*if succeeded lets read the ready scrim json and do some validation*/
            fs.readFile('./games/scrim.json', (err, content) => {
                if (err) return console.error(err);
                const roster = JSON.parse(content);
                if (Object.values(roster.team1).length != 5 && Object.values(roster.team2).length != 5) return message.channel.send('Not enough players.');
                if (!Object.keys(roster.team1).includes(message.author.id) && !Object.keys(roster.team2).includes(message.author.id)) return message.channel.send('You are not on the roster');

                /*validation succeeded, lets load the the team 1 and write scrim template*/
                /*get5 scrims only want "team1", no need to worry about team2 anyone else*/
                const rosterArray = Object.values(roster.team1);
                const scrimRoster = new Roster(rosterArray);
                startServer(scrimRoster, args[1], message, bot, child);

            });
        }

        if (args[0] === 'clear') {
            clearRoster(message);
            clearTeams();
        }
        if (args[0] === 'test') {
            if (message.author.id != '183934154558275584') return;
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

                })
            }
        }

    }
}
/**
* Starts the server. 
* @param scrimRoster {object} object of scrimRoster class
* @param map {object} map object
* @param message {object} discordjs message class object 
* @param bot {object} discordjs bot class object
* @param child {object} sh instance
*/
function startServer(scrimRoster, map, message, bot, child) {
    console.log(`${CSGO_PATH}/csgo/addons/sourcemod/configs/get5/scrim_template.cfg`, scrimRoster.config)
    fs.writeFile(`${CSGO_PATH}/csgo/addons/sourcemod/configs/get5/scrim_template.cfg`, scrimRoster.config, async err => {
        if (err) { return console.error(err) };
        if (map.id === '') {
            console.log(map)
            child.stdin.write(`./srcds_run -game csgo -tickrate 128 -net_port_try 1 -port 27015 -console -usercon +game_type 0 +game_mode 1 +map ${map.name} -debug +maxplayers 12 +sv_setsteamaccount ${CSGO_srv_token}\n`);
        }
        if (map.id !== '') {
            console.log(map, 'workshop :D')
            child.stdin.write(`./srcds_run -game csgo -tickrate 128 -net_port_try 1 -port 27015 -console -usercon +game_type 0 +game_mode 1 +host_workshop_map ${map.id} -debug +maxplayers 12 +sv_setsteamaccount ${CSGO_srv_token} -authkey ${steam_web_api_key}\n`);
        }

        const msg = await message.channel.send('Sierra hyrskyttää...');
        connectString()
        bot.setTimeout(() => {
            msg.edit(`\`${connect}\`, Map is: ${map.name}. please use the command **"!scrim end"** after the match is over.`);
        }, 15000);
        bot.setTimeout(() => {
            child.stdin.write('get5_scrim\n')
        }, 25000)
    });
}

function clearRoster(message) {
    const roster = {
        "team1": {},
        "team2": {}
    };
    fs.writeFile('./games/scrim.json', JSON.stringify(roster, null, '\t'), err => {
        if (err) return console.error(err);
        message.channel.send('Scrim cleared, and server killed.');
    });
}

function clearTeams() {
    team1 = [];
    team2 = [];
}
/**
* team should be either "team1" or "team2"
* @param team {string} team, "team1" or "team2"
* @param mentionedUserId {discordUserId} user id of the discord user
* @param mentionedUserName {string} username that matches that string
* @param message {object} discord message class object 
* @param bot {object} the bot
*/
function addToTeam(team, mentionedUserId, mentionedUserName, message, bot) {
    console.log(team, mentionedUserId, mentionedUserName)
    // Some shit code that Geary sent me :D 
    // https://discord.com/channels/494227219757924363/674251375709913118/864634709651882014
    const mentionedUserNickName = (!bot.guilds.cache.first().members.cache.get(mentionedUserId).nickname) ? bot.guilds.cache.first().members.cache.get(mentionedUserId).user.username : bot.guilds.cache.first().members.cache.get(mentionedUserId).nickname;
    fs.readFile('./games/scrim.json', async (err, content) => {
        let roster = JSON.parse(content);
        if (err) return console.error(err);
        delete roster['team1'][mentionedUserId];
        delete roster['team2'][mentionedUserId];
        fs.readFile('./games/steamid.json', (err, content) => {
            if (err) return console.error(err);
            const steamid = JSON.parse(content);
            roster[team][mentionedUserId] = steamid[mentionedUserId];
            fs.writeFile('./games/scrim.json', JSON.stringify(roster, null, '\t'), err => {
                if (err) return console.error(err);
                /*Shit code to show the teams on "frontend" */
                team1 = team1.filter(name => { return name != mentionedUserNickName })
                team2 = team2.filter(name => { return name != mentionedUserNickName })
                if (team === 'team1') { team1.push(mentionedUserNickName) }
                if (team === 'team2') { team2.push(mentionedUserNickName) }

                message.channel.send(scrimTeamsEmbed(team1, team2));
            });
        });
    });
}

/** 
* @param team1 {array/object} Global array for the team 1
* @param team2 {array/object} Global array for the team 2
* @returns {object} Returns Discord embed object 
*/
function scrimTeamsEmbed(team1, team2) {
    const embed = new Discord.MessageEmbed().setTitle('5v5 Scrim Roster').setColor('#ff5555')
        .addField(`Team 1 - ${team1.length}`, team1.join('\n') || 'empty', true)
        .addField(`Team 2 - ${team2.length}`, team2.join('\n') || 'empty', true);
    return embed
}
/**
 * This is nameDoesNotExist because for some reason I cant make the function work like I want it
 * One possible fix would be to do return !array.some--- but thats for another time 
 * @param {string} map name 
 * @param {array} put in json with name as a field  
 * @returns {boolean}
 */
function nameDoesNotExist(value, array) {
    return array.some(e => e.name.toLowerCase() === value.toLowerCase());
}

/**
 * This is idDoesNotExist because for some reason I cant make the function work like I want it
 * One possible fix would be to do return !array.some--- but thats for another time 
 * @param {string} map name 
 * @param {array} put in json with name as a field  
 * @returns {boolean}
 */
function idDoesNotExist(value, array) {
    return array.some(e => e.id.toLowerCase() === value.toLowerCase());
}
function getSingleMap(value, array) {
    const mapObj = array.filter(map => {
        return map.name.toLowerCase() === value.toLowerCase();
    })
    return mapObj[0];
}

/**
 * Stupidly long function that does million things
 * Gets the workshop map data from Steam
 * Saves it to the JSON
 * Sends OK message to the Discord channel it was asked to do so
 * @param {*} workshopID 
 * @param {*} maps 
 * @param {*} bot 
 * @param {*} message 
 */
function getWorkshopDataFromSteam(workshopID, maps, bot, message) {
    const xFormBody = `${encodeURI('itemcount')}=${encodeURI(1)}&${encodeURI('publishedfileids[0]')}=${encodeURI(workshopID)}`;
    const options = {
        hostname: 'api.steampowered.com',
        path: '/ISteamRemoteStorage/GetPublishedFileDetails/v1',
        port: 80,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(xFormBody)
        },
        method: 'POST',
        agent: false  // Create a new agent just for this one request
    }

    const req = http.request(options, function (res) {
        let result = '';
        res.on('data', (chunk) => {
            result += chunk;
        });
        res.on('end', () => {
            result = JSON.parse(result);
            let mapName = sanitizeMapName(result.response.publishedfiledetails[0].title)
            mapObj.name = mapName
            mapObj.id = workshopID;
            mapObj.url = workshopURL.href;
            maps.push(mapObj);
            // TODO: Check that it is a map
            fs.writeFile('./games/maps.json', JSON.stringify(maps, undefined, 4), async err => {
                if (err) return console.error(err);
                message.channel.send(`To the surprise of all of us, it worked. ${mapObj.name} added.`)
            })
        })
        res.on('error', (err) => {
            console.log(err);
        })
    });

    // req error
    req.on('error', function (err) {
        console.log(err, 'error?');
        message.channel.send(`Something went wrong, please tag Timmy ${err}`)
    });
    req.write(xFormBody);
    req.end();
}

function sanitizeMapName(mapName) {
    let mapName2 = mapName.replace(/ /g, '-');
    mapName2 = mapName2.replace(/\(/g, '');
    mapName2 = mapName2.replace(/\)/g, '');
    mapName2 = mapName2.replace(/\|/g, '');
    mapName2 = mapName2.replace(/\[/g, '');
    mapName2 = mapName2.replace(/\]/g, '');
    return mapName2
}