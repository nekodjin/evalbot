// check for required env vars
if (process.env.CONFIG_PATH == undefined)
{
    console.log('You must specify the path to the config file via the CONFIG_PATH environment variable.');
    process.exit(1);
}

// dependencies
const fs = require('fs');
const discord = require('discord.js');
const rust = require('./rust.js');

// check if config file exists
if (!fs.existsSync(process.env.CONFIG_PATH))
{
    console.log(`The config file at ${process.env.CONFIG_PATH} does not exist.`);
    process.exit(2);
}

// constants
const config = JSON.parse(fs.readFileSync(process.env.CONFIG_PATH))
const client = new discord.Client();

// check if config file satisfies requirements
if (config.token == undefined)
{
    console.log('The config file must include the `token` property.');
    process.exit(3);
}

if (typeof(config.token) != 'string')
{
    console.log('The token property must be a string.');
    process.exit(4);
}

if (config.lurk == undefined)
{
    config.lurk = false;
}

if (typeof(config.lurk) != 'boolean')
{
    console.log('The lurk property must be a boolean.');
    process.exit(5);
}

if (config.prefix == undefined)
{
    config.prefix = 'evb!';
}

if (typeof(config.prefix) != 'string')
{
    console.log('The prefix property must be a string.');
    process.exit(6);
}

// ready event handler
client.on('ready', () => {
    console.log('EvalBot is online.');
    if (config.lurk)
    {
        client.user.setStatus('invisible');
    }
    else
    {
        client.user.setActivity(`${config.prefix}help`, {type: 'LISTENING'});
    }
});

client.on('message', msg => {
    // ignore bot messages
    if (msg.author.bot) return;

    var content = msg.content;

    if (content.startsWith(config.prefix))
    {
        msg.reply('Yeet');
    }

    if (msg.content.match(/```(?:rust|rs)(?<code>.*)```/s))
    {
        let code = msg.content.match(/```(?:rust|rs)(?<code>.*)```/s).groups.code;
        rust.exec(msg.channel, code);
    }
});

client.login(config.token);
