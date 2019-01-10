const Notification = require('../models/Notification');
const mapping = require('../utils/CodeMessageMapping');
const { parseSort } = require('../utils/tools');
const { debug } = require('../../config');

const NotificationController = () => {
  const getAll = async (req, res) => {
    try {
      let { pageSize = 10, currentPage = 1 } = req.query;
      const { sort = 'id.asc' } = req.query;
      pageSize = parseInt(pageSize, 10);
      currentPage = parseInt(currentPage, 10);
      const { count } = await Notification.findAndCountAll();
      const pages = Math.ceil(count / pageSize);
      const offset = pageSize * (currentPage - 1);
      const order = parseSort(sort);
      const notifications = await Notification.findAll({
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
          notifications,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  const get = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    try {
      const notification = await Notification.findOne({
        where: {
          id,
        },
      });
      if (!notification) {
        return res.status(400).json({ ...mapping.bad_request_notification_not_found });
      }
      return res.status(200).json({ ...mapping.ok, data: { notification } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  const create = async (req, res) => {
    // body is part of form-data
    const { body } = req;
    try {
      delete body.id;
      const createdNotification = await Notification.create({
        ...body,
      });
      // console.info(`created notification ${JSON.stringify(createdNotification, null, 2)}`);
      return res.status(200).json({ ...mapping.ok, data: { notification: createdNotification } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  const update = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    // body is part of form-data
    const { body } = req;
    try {
      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(400).json({ ...mapping.bad_request_notification_not_found });
      }
      const needUpdateNotification = {
        ...notification,
        ...body,
        id,
      };
      const updatedNotification = await notification.update(needUpdateNotification);
      // console.info(`update notification ${JSON.stringify(updatedNotification, null, 2)}`);
      return res.status(200).json({ ...mapping.ok, data: { updatedNotification } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  const destroy = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    try {
      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(400).json({ ...mapping.bad_request_notification_not_found });
      }
      await notification.destroy();
      return res.status(200).json({ ...mapping.ok, data: { notification } });
    } catch (err) {
      // better save it to log file
      console.error(err);
      return res
        .status(500)
        .json(debug ? { ...mapping.internal_error, data: err } : { ...mapping.internal_error });
    }
  };

  const batchDestroy = async (req, res) => {
    // params is part of an url
    const { id = [] } = req.body;
    try {
      id.forEach(async (idValue) => {
        const notification = await Notification.findById(idValue);
        if (notification) {
          await notification.destroy();
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
    getAll,
    get,
    create,
    update,
    destroy,
    batchDestroy,
  };
};

module.exports = NotificationController;
