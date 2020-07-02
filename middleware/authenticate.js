let jwt = require('jsonwebtoken');
let helpers = require('../helpers/common');

function autheticate (req, res, next) {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if ((typeof token === 'undefined') || !token) {
      helpers.throwError(401, 'request error', 'Auth token is not supplied')();
    } else {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      } else {
        helpers.throwError(401, 'request error', 'Token is not valid s')();
      }

      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          helpers.throwError(401, 'request error', 'Token is not valid')(err);
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  } catch(e) {
    return helpers.sendError(res, e.code, e.error)(e);
  }
};

module.exports = [
  autheticate
]
