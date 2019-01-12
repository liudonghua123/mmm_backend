const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const mapping = require('../utils/CodeMessageMapping');
const { parseSort } = require('../utils/tools');
const { Op } = require('sequelize');
const { debug } = require('../../config');

const UserController = () => {
  /**
   * @typedef UserModel
   * @property {string} username.required - username or email of person making request - eg: John Doe
   * @property {string} password.required - password of person making request - eg: John Doe
   * @property {string} email - email of person making request - eg: John Doe
   * @property {string} name - name of person making request - eg: John Doe
   * @property {string} gender - gender of person making request - eg: John Doe
   * @property {string} institute - institute of person making request - eg: John Doe
   * @property {string} arrvalDate - arrvalDate of person making request - eg: John Doe
   * @property {string} departureDate - departureDate of person making request - eg: John Doe
   * @property {string} room - room of person making request - eg: John Doe
   * @property {string} dietRequirement - dietRequirement of person making request - eg: John Doe
   * @property {string} talkTitle - talkTitle of person making request - eg: John Doe
   * @property {string} talkAbstract - talkAbstract of person making request - eg: John Doe
   * @property {string} phone - phone of person making request - eg: John Doe
   */

  /**
   * @typedef UserLoginReq
   * @property {string} username.required - username or email of person making request - eg: John Doe
   * @property {string} password.required - password of person making request - eg: John Doe
   */

  /**
   * @typedef Response
   * @property {string} code.required
   * @property {string} message.required
   * @property {object} data
   */

  /**
   * @typedef Error
   * @property {string} code.required
   * @property {string} message.required
   * @property {object} data
   */

  /**
   * @typedef UserIdArray
   * @property {array} id.required
   */

  /**
   * This route will register new user
   * @route POST /api/public/register
   * @group UserController - User module
   * @param {UserModel.model} userLoginReq.body.required - username/email and password for register
   * @returns {Response.model} 200 - An object with 'code', 'message', 'data'
   * @returns {Error.model}  default - Unexpected error
   * @produces application/json
   * @consumes application/json
   */
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
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  /**
   * This route will for user login
   * @route POST /api/public/login
   * @group UserController - User module
   * @param {UserLoginReq.model} userLoginReq.body.required - username/email and password for login
   * @returns {Response.model} 200 - An object with 'code', 'message', 'data'
   * @returns {Error.model}  default - Unexpected error
   * @produces application/json
   * @consumes application/json
   */
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
          return res.status(400).json({ ...mapping.bad_request_user_not_found });
        }
        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({ id: user.id, authority: user.authority });
          return res.status(200).json({
            code: 0,
            message: 'ok',
            data: { token, user },
          });
        }
        return res.status(401).json({ ...mapping.bad_request_username_password_mismatch });
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
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

  /**
   * This route will get all users
   * @route GET /api/private/users/
   * @group UserController - User module
   * @operationId findUsers
   * @returns {Response.model} 200 - An object with 'code', 'message', 'data'
   * @returns {Error.model}  default - Unexpected error
   * @produces application/json
   * @consumes application/json
   * @security JWT
   */
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
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  /**
   * This route will get user by id
   * @route GET /api/private/users/{id}
   * @group UserController - User module
   * @param {string} id.path.required - the id of the user
   * @operationId findUserById
   * @returns {Response.model} 200 - An object with 'code', 'message', 'data'
   * @returns {Error.model}  default - Unexpected error
   * @produces application/json
   * @consumes application/json
   * @security JWT
   */
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
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  /**
   * This route will create user
   * @route POST /api/private/users/
   * @group UserController - User module
   * @param {UserModel.model} usermodel.body.required - the new user model
   * @operationId createUser
   * @produces application/json application/xml
   * @consumes application/json application/xml
   * @returns {Response.model} 200 - An array of user info
   * @returns {Error.model}  default - Unexpected error
   * @security JWT
   */
  const create = async (req, res) => {
    // body is part of form-data
    const { body } = req;
    try {
      delete body.id;
      const createdUser = await User.create({
        ...body,
      });
      // console.info(`created user ${JSON.stringify(createdUser, null, 2)}`);
      return res.status(200).json({ ...mapping.ok, data: { user: createdUser } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  /**
   * This route will update user
   * @route PUT /api/private/users/{id}
   * @group UserController - User module
   * @param {string} id.path.required - the id of the user
   * @param {UserModel.model} usermodel.body.required - the updated user model
   * @operationId updateUser
   * @produces application/json application/xml
   * @consumes application/json application/xml
   * @returns {Response.model} 200 - An array of user info
   * @returns {Error.model}  default - Unexpected error
   * @security JWT
   */
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
      const needUpdateUser = {
        ...user,
        ...body,
        id,
      };
      const updatedUser = await user.update(needUpdateUser);
      // console.info(`update user ${JSON.stringify(updatedUser, null, 2)}`);
      return res.status(200).json({ ...mapping.ok, data: { updatedUser } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  /**
   * This route will delete user by id
   * @route DELETE /api/private/users/{id}
   * @group UserController - User module
   * @param {string} id.path.required - the id of the user
   * @operationId deleteUser
   * @produces application/json application/xml
   * @consumes application/json application/xml
   * @returns {Response.model} 200 - An array of user info
   * @returns {Error.model}  default - Unexpected error
   * @security JWT
   */
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
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  /**
   * This route will delete users by ids
   * @route DELETE /api/private/users/
   * @group UserController - User module
   * @param {UserIdArray.model} id.body.required - the ids of the user
   * @operationId deleteUsers
   * @produces application/json application/xml
   * @consumes application/json application/xml
   * @returns {Response.model} 200 - An array of user info
   * @returns {Error.model}  default - Unexpected error
   * @security JWT
   */
  const batchDestroy = async (req, res) => {
    // params is part of an url
    const { id = [] } = req.body;
    try {
      id.forEach(async (idValue) => {
        const user = await User.findById(idValue);
        if (user) {
          await user.destroy();
        }
      });
      return res.status(200).json({ ...mapping.ok, data: { id } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
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
