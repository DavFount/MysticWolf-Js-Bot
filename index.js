const fs = require('fs');
const config = require('./config.json');
const helpers = require('./helpers.js');

const sequelize = require('./db.js');
const User = require('./models/users.js');
const Guild = require('./models/guilds.js');

// sequelize.sync({
//     force: true
// });

// User.sync({
//     force: true
// });
// Guild.sync({
//     force: true
// });

User.belongsToMany(Guild, {
    through: 'User_Guilds'
});
Guild.belongsToMany(User, {
    through: 'User_Guilds'
});

const {
    Client,
    Collection,
} = require('discord.js');

const client = new Client();
client.commands = new Collection();
const cooldowns = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    setActivity();

    // First run only.
    // client.guilds.cache.forEach(guild => {
    //     Guild.findOrCreate({
    //         where: {
    //             guildId: guild.id
    //         },
    //         defaults: {
    //             name: guild.name,
    //             joinTimestamp: guild.joinedAt,
    //             createdTimestamp: guild.createdAt
    //         }
    //     }).then(([guild, created]) => {
    //         console.log(guild.get({
    //             plain: true
    //         }));
    //         console.log(created);
    //     });
    // });
});

client.on('guildCreate', guild => {
    console.log(`New guild joined: ${guild.name} (id: {guild.id}). This guild has ${guild.memberCount} members!`);
    setActivity();

    Guild.findOrCreate({
        where: {
            guildId: guild.id
        },
        defaults: {
            name: guild.name,
            joinTimestamp: guild.joinedAt,
            createdTimestamp: guild.createdAt
        }
    }).then(([guild, created]) => {
        // Do nothing it either worked or it didnt.
    });
});

client.on('guildDelete', guild => {
    console.log(`I have been removed from ${guild.name} (id: ${guild.id})`);
    setActivity();

    Guild.findOne({
        where: {
            discordId: guild.id
        }
    }).then(g => {
        g.update({
            disjoinTimestamp: sequelize.fn('NOW')
        });
    });
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === config.introChannel);
    const role = member.guild.roles.cache.find(role => role.name === config.default_role);

    member.roles.add(role);
    setActivity();

    if (!channel) return;
    channel.send(`Welcome to ${member.guild.name}, ${member}`);

    let roles = [];
    member.roles.cache.forEach(role => {
        roles.push(role.name);
    });

    User.findOrCreate({
        where: {
            discordId: member.id,
        },
        defaults: {
            tag: member.user.tag,
            username: member.user.username,
            nickname: member.nickname,
            discordId: member.id,
            joinTimestamp: member.joinedAt,
            createdTimestamp: member.user.createdAt,
            roles: roles.join()
        }
    }).then(([user, created]) => {
        if (created) {
            Guild.findOne({
                where: {
                    guildId: member.guild.id
                }
            }).then(guild => {
                user.addGuild(guild);
            });
        } else {
            user.Update({
                rejoin: true
            });
        }
    });
});

client.on('guildMemberRemove', member => {
    setActivity();
    User.findOne({
        where: {
            discordId: member.id
        }
    }).then(user => {
        user.update({
            disjoinTimestamp: sequelize.fn('NOW')
        });
    });
});

client.on('message', async message => {
    if (message.author.bot || message.content.indexOf(config.trigger) !== 0 || !message.guild) return;

    const args = message.content.slice(config.trigger.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        const errorMessage = 'Invalid arguments: Check the usage and example section below';
        return message.channel.send(helpers.commandUsageEmbed(command, errorMessage));
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            const errorMessage = `Cooldown Restriction: Please wait ${timeLeft.toFixed(1)} more second(s).`;
            return message.channel.send(helpers.commandUsageEmbed(command, errorMessage));
        }
    }

    try {
        command.execute(message, args);
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

function setActivity() {
    client.user.setActivity(`${client.users.cache.size} users in ${client.guilds.cache.size} guilds!`, {
        type: 'WATCHING'
    });
}



client.login(config.token);