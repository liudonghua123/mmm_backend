const privateRoutes = {
  'GET /users/': 'UserController.getAll',
  'GET /users/:id': 'UserController.get',
  'POST /users/': 'UserController.create',
  'DELETE /users/': 'UserController.batchDestroy',
  'PUT /users/:id': 'UserController.update',
  'DELETE /users/:id': 'UserController.destroy',
};

module.exports = privateRoutes;
