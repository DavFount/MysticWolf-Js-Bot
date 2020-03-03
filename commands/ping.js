module.exports = {
    name: 'ping',
    description: 'Ping!',
    guildOnly: true,
    args: false,
    usage: '',
    example: '',
    cooldown: 3,
    execute(message, args) {
        message.channel.send('Pong!');
    },
};