//Based on code by Geary Wariwisaya. Used under MIT licence

const { CSGO_PATH, prefix, token } = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client({ disableEveryone: true });

bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

for (const f of commandFiles) {
    const command = require(`./cmds/${f}`);
    bot.commands.set(command.name, command);
}
const child = spawn('sh');
child.stdout.on('data', data => { console.log(`stdout: ${data}`) });
child.stderr.on('data', data => { console.log(`stderr: ${data}`) });
child.on('error', err => { console.log(`child error: ${err}`) });
child.stdin.write(`cd ${CSGO_PATH}\n`);
child.on('close', code => { console.log(`child process closed with code ${code}`) });
child.on('exit', code => { console.log(`child process exited with code ${code}`) });

bot.login(token);

bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.username}`);
});

bot.on('message', async (message) => {
    if (message.author.bot) return; //*  ignores messages made by bots
    if (message.channel.type === ('dm' || 'group')) return; //* ignores messages outside of channels
    if (message.content.toLowerCase().includes('\`')) return; //* ignores messages with code blocks

    const args = message.content.toLowerCase().split(/ +/);
    const commandName = args.shift();

    if (commandName.startsWith(prefix)) {
        try {
            const cmds = commandName.slice(prefix.length);
            const command = bot.commands.get(cmds) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmd));
            if (cmds.includes(prefix)) return;
            if (!command) return;
            if (command.args && !args.length) return message.channel.send(`Anna argumentti. Kirjoita \`${prefix}help ${command.name}\` nähdäksesi kuinka komentoa käytetään.`);

            command.execute(bot, message, args);
        } catch (error) {
            console.error(error);
            message.channel.send('Lol joku virhe :D');
            message.guild.members.get('183934154558275584').send(error);
        }
    }
});