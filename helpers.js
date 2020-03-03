const config = require('./config.json');
const {
    MessageEmbed,
} = require('discord.js');

module.exports = {
    isAdmin: (member) => {
        return member.roles.cache.some(role => (
            config.admin_roles.includes(role.name)
        ));
    },
    hasDefaultRole: (member) => {
        return member.roles.cache.some(role => (
            config.default_role == role.name
        ));
    },
    commandUsageEmbed: (command, message = '') => {
        const embed = new MessageEmbed()
            .setColor('#6e0002')
            .setTitle(`Command: ${config.trigger}${command.name}`)
            .setDescription(message)
            .addField('**Description:**', `${command.description}`)
            .addField('**Cooldown:**', `${command.cooldown} Seconds`)
            .addField('**Usage:**', `${config.trigger}${command.name} ${command.usage}`)
            .addField('**Example:**', `${config.trigger}${command.name} ${command.example}`);

        return embed;
    },
    getUserFromMention: (client, mention) => {
        const matches = mention.match(/^<@!?(\d+)>$/);
        if (!matches) return;
        const id = matches[1];
        return client.users.cache.get(id);
    },
};