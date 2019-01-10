const privateRoutes = {
  'GET /users/': 'UserController.getAll',
  'GET /users/:id': 'UserController.get',
  'POST /users/': 'UserController.create',
  'DELETE /users/': 'UserController.batchDestroy',
  'PUT /users/:id': 'UserController.update',
  'DELETE /users/:id': 'UserController.destroy',
  'GET /notifications/': 'NotificationController.getAll',
  'GET /notifications/:id': 'NotificationController.get',
  'POST /notifications/': 'NotificationController.create',
  'DELETE /notifications/': 'NotificationController.batchDestroy',
  'PUT /notifications/:id': 'NotificationController.update',
  'DELETE /notifications/:id': 'NotificationController.destroy',
};

module.exports = privateRoutes;
