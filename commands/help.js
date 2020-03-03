/* eslint-disable indent */
const config = require('../config.json');
const helpers = require('../helpers.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const data = [];
        const {
            commands,
        } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${config.trigger}help [command name]\` to get information on a specific command!`);

            return message.author.send(data, {
                    split: true,
                })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all of my commands');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('It seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('That\'s not a valid command');
        }

        message.channel.send(helpers.commandUsageEmbed(command));
    },
};