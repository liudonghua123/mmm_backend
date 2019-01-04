const publicRoutes = {
  'POST /register': 'UserController.register',
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
};

module.exports = publicRoutes;
