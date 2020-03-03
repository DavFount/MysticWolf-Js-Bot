const Sequelize = require('sequelize');
const sequelize = require('./../db.js');

class User extends Sequelize.Model {}
User.init({
    tag: Sequelize.STRING,
    username: Sequelize.STRING,
    nickname: {
        type: Sequelize.STRING,
        allowNull: true
    },
    discordId: Sequelize.STRING,
    joinTimestamp: Sequelize.DATE,
    createdTimestamp: Sequelize.DATE,
    disjoinTimestamp: {
        type: Sequelize.DATE,
        allowNull: true
    },
    roles: Sequelize.STRING,
    rejoin: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'user'
});

module.exports = User;