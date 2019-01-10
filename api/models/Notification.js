const Sequelize = require('sequelize');
const moment = require('moment');

const sequelize = require('../../config/database');

const dateFormat = 'YYYY-MM-DD';

const tableName = 'notifications';

const Notification = sequelize.define(
  'Notification',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: true,
    },
  },
  { tableName },
);

module.exports = Notification;
