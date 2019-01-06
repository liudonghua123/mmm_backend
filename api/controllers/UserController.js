const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const mapping = require('../utils/CodeMessageMapping');
const { parseSort } = require('../utils/tools');
const { Op } = require('sequelize');

const UserController = () => {
  const register = async (req, res) => {
    const { body } = req;
    try {
      const user = await User.create({
        ...body,
      });
      console.info(`login created user ${JSON.stringify(user, null, 2)}`);
      const token = authService().issue({ id: user.id, authorigy: user.authorigy });
      return res.status(200).json({ ...mapping.ok, data: { token, user } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ...mapping.internal_error });
    }
  };

  const login = async (req, res) => {
    // the username maybe the actural username or email
    const { username, password } = req.body;
    if (username && password) {
      try {
        const user = await User.findOne({
          where: {
            [Op.or]: [{ username }, { email: username }],
          },
        });
        if (!user) {
          return res.status(400).json({ ...mapping.bad_request_username_password_mismatch });
        }
        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({ id: user.id, authority: user.authority });
          return res.status(200).json({
            code: 0,
            message: 'ok',
            data: { token, user },
          });
        }
        return res.status(401).json({ ...mapping.unauthorized });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ ...mapping.internal_error });
      }
    }
    return res.status(400).json({ ...mapping.bad_request_username_password_wrong });
  };

  const validate = (req, res) => {
    const { token } = req.body;
    authService().verify(token, (err) => {
      if (err) {
        return res.status(401).json({ ...mapping.invalid_token, data: { isvalid: false } });
      }
      return res.status(200).json({ ...mapping.ok, data: { isvalid: true } });
    });
  };

  const getAll = async (req, res) => {
    try {
      let { pageSize = 10, currentPage = 1 } = req.query;
      const { sort = 'id.asc' } = req.query;
      pageSize = parseInt(pageSize, 10);
      currentPage = parseInt(currentPage, 10);
      const { count } = await User.findAndCountAll();
      const pages = Math.ceil(count / pageSize);
      const offset = pageSize * (currentPage - 1);
      const order = parseSort(sort);
      const users = await User.findAll({
        limit: pageSize,
        offset,
        order,
      });
      return res.status(200).json({
        ...mapping.ok,
        data: {
          count,
          currentPage,
          pageSize,
          pages,
          users,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ...mapping.internal_error });
    }
  };

  const get = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    try {
      const user = await User.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        return res.status(400).json({ ...mapping.bad_request_user_not_found });
      }
      return res.status(200).json({ ...mapping.ok, data: { user } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res.status(500).json({ ...mapping.internal_error });
    }
  };

  const create = async (req, res) => {
    // body is part of form-data
    const { body } = req;
    try {
      delete body.id;
      const createdUser = await User.create({
        ...body,
      });
      console.info(`created user ${JSON.stringify(createdUser, null, 2)}`);
      return res.status(200).json({ ...mapping.ok, data: { user: createdUser } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res.status(500).json({ ...mapping.internal_error });
    }
  };

  const update = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    // body is part of form-data
    const { body } = req;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ ...mapping.bad_request_user_not_found });
      }
      const updatedUser = await user.update({
        ...body,
        id,
      });
      console.info(`update user ${JSON.stringify(updatedUser, null, 2)}`);
      return res.status(200).json({ ...mapping.ok, data: { updatedUser } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res.status(500).json({ ...mapping.internal_error });
    }
  };

  const destroy = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ ...mapping.bad_request_user_not_found });
      }
      await user.destroy();
      return res.status(200).json({ ...mapping.ok, data: { user } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res.status(500).json({ ...mapping.internal_error });
    }
  };

  const batchDestroy = async (req, res) => {
    // params is part of an url
    const { id = [] } = req.body;
    try {
      id.forEach(async (idValue) => {
        const user = await User.findById(idValue);
        if (user) {
          // await user.destroy();
        }
      });
      return res.status(200).json({ ...mapping.ok, data: { id } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res.status(500).json({ ...mapping.internal_error });
    }
  };

  return {
    register,
    login,
    validate,
    getAll,
    get,
    create,
    update,
    destroy,
    batchDestroy,
  };
};

module.exports = UserController;
