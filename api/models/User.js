const Sequelize = require('sequelize');
const moment = require('moment');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');

const dateFormat = 'YYYY-MM-DD';

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
  beforeUpdate(user) {
    if (user.changed('password')) {
      user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
    }
  },
};

const datePropertyGetter = (context, property) =>
  (context.getDataValue(property) ? moment(context.getDataValue(property)).format(dateFormat) : '');

const datePropertySetter = (context, property, val) => {
  if (val) {
    context.setDataValue(property, moment(val).format(dateFormat));
  }
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
    name: {
      type: Sequelize.STRING,
      defaultValue: '',
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
      field: 'arrival_date',
      get() {
        return datePropertyGetter(this, 'arrivalDate');
      },
      set(val) {
        datePropertySetter(this, 'arrivalDate', val);
      },
    },
    departureDate: {
      type: Sequelize.DATE,
      field: 'departure_date',
      get() {
        return datePropertyGetter(this, 'departureDate');
      },
      set(val) {
        datePropertySetter(this, 'departureDate', val);
      },
    },
    room: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    dietRequirement: {
      type: Sequelize.STRING,
      defaultValue: '',
      field: 'diet_requirement',
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
      defaultValue: true,
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
