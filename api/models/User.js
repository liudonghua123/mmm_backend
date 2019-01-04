const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'users';

const User = sequelize.define(
  'User',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      defaultValue: '',
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    institute: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    arrivalDate: {
      type: Sequelize.DATE,
      defaultValue: '',
      field: 'arrival_date',
    },
    departureDate: {
      type: Sequelize.DATE,
      defaultValue: '',
      field: 'departure_date',
    },
    room: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    dietRequirement: {
      type: Sequelize.STRING,
      defaultValue: '',
      field: 'departure_date',
    },
    talkTitle: {
      type: Sequelize.STRING,
      defaultValue: '',
      field: 'talk_title',
    },
    talkAbstract: {
      type: Sequelize.STRING,
      defaultValue: '',
      field: 'talk_abstract',
    },
    phone: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    authority: {
      type: Sequelize.STRING,
      defaultValue: 'user',
    },
  },
  { hooks, tableName },
);

// eslint-disable-next-line
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = User;
