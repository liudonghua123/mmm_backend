const JWTService = require('../services/auth.service');
const mapping = require('../utils/CodeMessageMapping');

const hasPermission = (req, authority) => {
  console.info(`check permission for ${req.method}: ${req.path} with authority: ${authority}`);
  const adminRoutes = [
    { method: 'GET', path: '/api/private/users/' },
    { method: 'POST', path: '/api/private/users/' },
    { method: 'DELETE', path: '/api/private/users/' },
  ];
  for (const adminRoute of adminRoutes) {
    if (req.method === adminRoute.method && req.path === adminRoute.path) {
      return authority === 'admin';
    }
  }
  return true;
};

// usually: "Authorization: Bearer [token]" or "<url>?token=token" or "token: [token]"
module.exports = (req, res, next) => {
  let tokenToVerify;

  if (req.header('Authorization')) {
    const parts = req.header('Authorization').split(' ');

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials;
      } else {
        return res.status(401).json({ ...mapping.authorization_format_error });
      }
    } else {
      return res.status(401).json({ ...mapping.authorization_format_error });
    }
  } else if (req.query.token) {
    tokenToVerify = req.query.token;
  } else if (req.body.token) {
    tokenToVerify = req.body.token;
    // delete req.query.token;
  } else {
    return res.status(401).json({ ...mapping.authorization_not_found });
  }
  // console.info(`tokenToVerify: ${tokenToVerify}`);
  return JWTService().verify(tokenToVerify, (err, thisToken) => {
    if (err) return res.status(401).json({ ...mapping.invalid_token, err });
    if (!hasPermission(req, thisToken.authority)) {
      return res.status(401).json({ ...mapping.authorization_privilege_not_sufficient });
    }
    req.token = thisToken;
    // console.info(`thisToken: ${JSON.stringify(thisToken)}`);
    return next();
  });
};
