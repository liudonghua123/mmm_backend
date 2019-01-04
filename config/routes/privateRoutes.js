const privateRoutes = {
  'GET /users/': 'UserController.getAll',
  'GET /users/:id': 'UserController.get',
  'POST /users/': 'UserController.create',
  'PUT /users/:id': 'UserController.update',
  'DELETE /users/:id': 'UserController.destroy',
};

module.exports = privateRoutes;
