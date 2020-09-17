/* eslint-disable indent */
const config = require('../config.json');
const helpers = require('../helpers.js');

module.exports = {
    name: 'accept',
    description: `Acceptance of a contract to be specified as an argument.`,
    aliases: [],
    usage: '<contract name>',
    cooldown: 5,
    example: 'community-rules',
    execute(message, args) {
        if (!args.length || !helpers.hasDefaultRole(message.member)) return;

        const contract = args[0];

        if (contract) {
            if (!config.server_contracts[contract]) return;

            switch (contract) {
                case 'community-rules':
                    const channel = message.channel;
                    if (channel.name === config.server_contracts[contract].channel) {
                        const defaultRole = message.guild.roles.cache.find(role => role.name === config.default_role);
                        const starterRole = message.guild.roles.cache.find(role => role.name === config.starter_role);

                        message.member.roles.remove(defaultRole);
                        message.member.roles.add(starterRole);
                        message.reply('Thank you for accepting our communities rules. You may now join the others in their discussions.');
                    } else {
                        message.reply(`You must be in the ${config.server_contracts[contract].channel} channel to accept that contract.`);
                    }
                    break;
            }
        } else {
            message.reply(`You must include a contract to accept.`);
        }
    },
};