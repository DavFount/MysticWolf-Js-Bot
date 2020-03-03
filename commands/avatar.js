const {
    RichEmbed,
} = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['icon', 'pfp'],
    description: 'Displays an avatar for a given user mention. If none it will return your own.',
    guildOnly: true,
    args: false,
    usage: '[user]',
    example: '@David (Exclude for your own avatar)',
    cooldown: 30,
    execute(message, args) {
        let avatar, userDisplayName;
        if (!message.mentions.users.size) {
            // attachment = new Attachment(message.author.avatarURL);
            avatar = message.author.avatarURL({
                format: 'png',
                dynamic: true
            });
            userDisplayName = message.author.tag;
        } else {
            // attachment = new Attachment(message.mentions.users.first().avatarURL);
            avatar = message.mentions.users.first().avatarURL({
                format: 'png',
                dynamic: true
            });
            userDisplayName = message.mentions.users.first().tag;
        }
        const embed = new RichEmbed()
            .setColor('#6e0002')
            .setTitle(userDisplayName)
            .setImage(avatar);

        message.channel.send(embed);
    },
};