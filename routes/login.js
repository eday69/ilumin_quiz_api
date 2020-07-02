const path = require('path');

let router = require('express').Router()
let qry = require('./login/query');
let helpers = require('../helpers/common');

/**
 * Base Route for Login
 * GET /login
 */
router.get('/', async (req, res, next) => {
    try {
        const results = await qry.getBaseRouteLogin();
        helpers.sendSuccess(res, 200, 'msg')(results);
    } catch (e) {
        helpers.sendError(res, e.code)(e);
    }
});

/**
 * Validate user login credentials.
 * POST /login
 */
router.post('/', async (req, res, next) => {

	var email = req.body.email;
	var password = req.body.password;
  try {
    const results = await qry.validateLogin(email, password);
      helpers.sendSuccess(res, 200, 'msg')(results);

      next();
  } catch (e) {
    helpers.sendError(res, e.code)(e);
  }

});

/**
 * Validate user login credentials.
 * POST /login/register
 */
router.post('/register', async (req, res, next) => {

  try {
      const results = await qry.registerUser(req.body);
      helpers.sendSuccess(res, 200, 'msg')(results);

      next();
  } catch (e) {
      helpers.sendError(res, e.code)(e);
  }

});

/**
 * Reset password request from user
 * POST /login/resetpassword
 */
router.post('/resetpassword', async(req, res, next) => {

  var email = req.body.email;
  try {
      const results = await qry.resetPassword(email);
      helpers.sendSuccess(res, 200, 'msg')(results);

      next();
  } catch (e) {
      helpers.sendError(res, e.code)(e);
  }
});

/**
 * Validate token to reset password
 * POST /login/validtoken
 */
router.post('/validtoken/:token', async(req, res, next) => {

  var token = req.params.token;
  try {
      const results = await qry.validToken(token);
      helpers.sendSuccess(res, 200, 'msg')(results);

      next();
  } catch (e) {
      helpers.sendError(res, e.code)(e);
  }
});

/**
 * Change password s
 * POST /login/newpassword
 */
router.post('/newpassword', async(req, res, next) => {

  var token = req.body.resettoken;
  var pwd = req.body.newPassword;
  try {
      const results = await qry.newPassword(token, pwd);
      helpers.sendSuccess(res, 200, 'msg')(results);

      next();
  } catch (e) {
      helpers.sendError(res, e.code)(e);
  }
});

module.exports = router;
