const config = require('./config.json');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(`mysql://${config.db_username}:${config.db_password}@${config.db_host}:${config.db_port}/${config.db_name}`, {
    logging: false,
});

module.exports = sequelize;