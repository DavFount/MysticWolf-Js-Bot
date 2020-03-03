const helpers = require('../helpers.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a player from the guild.',
    guildOnly: true,
    args: true,
    usage: '<user> <reason>',
    cooldown: 3,
    example: '@David Get Out Now!',
    execute(message, args) {
        if (!message.member.hasPermission('KICK_MEMBERS', false, true, true)) return;
        const user = helpers.getUserFromMention(message.client, args[0]);

        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member.kick(args.slice(1).join(' ')).then(() => {
                    message.reply(`Successfully kicked ${user.tag}`);
                }).catch(err => {
                    message.reply('I was unable to kick the member');
                    console.error(err);
                });
            } else {
                message.reply('That user isn\'t in this guild!');
            }
        } else {
            message.reply('You didn\'t mention the user to kick!');
        }
    },
};