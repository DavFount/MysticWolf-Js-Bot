const helpers = require('../helpers.js');

module.exports = {
    name: 'ban',
    description: 'Bans a player from the guild.',
    guildOnly: true,
    args: true,
    usage: '<user> <reason>',
    cooldown: 3,
    example: '@David You\'ve exceeded your welcome!',
    execute(message, args) {
        if (!message.member.hasPermission('BAN_MEMBERS', false, true, true)) return;
        const user = helpers.getUserFromMention(message.client, args[0]);

        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member.ban(args.slice(1).join(' ')).then(() => {
                    message.reply(`Successfully banned ${user.tag}`);
                }).catch(err => {
                    message.reply('I was unable to ban the member');
                    console.error(err);
                });
            } else {
                message.reply('That user isn\'t in this guild!');
            }
        } else {
            message.reply('You didn\'t mention the user to ban!');
        }
    },
};