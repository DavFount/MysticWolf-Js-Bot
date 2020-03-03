const Sequelize = require('sequelize');
const sequelize = require('./../db.js');

class Guild extends Sequelize.Model {}
Guild.init({
    guildId: Sequelize.STRING,
    name: Sequelize.STRING,
    joinTimestamp: Sequelize.DATE,
    createdTimestamp: Sequelize.DATE,
    disjoinTimestamp: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'guild'
});

module.exports = Guild;