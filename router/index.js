let router = require('express').Router()
let qry = require('./data/query');
let helpers = require('../helpers/common');

let { version: apiVersion } = require('../package')

// Middleware
// let middleware = [
//   require('../middleware/authenticate'),
// ]

// Default route
router.get('/', (req, res, next) => {
  res.send(`Hi, this is Prompt API version ${apiVersion}`)
})

// If we do not add the middleware, we are not checking for tokens.
// API resources
// router.use('/login', [], require('../routes/login'))
// router.use('/user', middleware, require('../routes/user'))

router.post('/prompt', async (req, res, next) => {

    var body = req.body;
    console.log('POST ', body);

    try {
        const results = await qry.savePrompt(body);
        helpers.sendSuccess(res, 200, 'msg')(results);
        next();
    } catch (e) {
        helpers.sendError(res, e.code)(e);
    }
});

router.get('/prompt/:token', async (req, res, next) => {
    var token = req.params.token;

    console.log('get xxx', token);
    try {
        const results = await qry.getPrompt(token);
        helpers.sendSuccess(res, 200, 'msg')(results);
        next();
    } catch (e) {
        helpers.sendError(res, e.code)(e);
    }

    // try {
    //     const results = await qry.getProfile(studentId);
    //     helpers.sendSuccess(res, 200, 'msg')(results);
    //     next();
    // } catch (e) {
    //     helpers.sendError(res, e.code)(e);
    // }
});

router.get('/quiz1', async (req, res, next) => {

    try {
        const results = await qry.getQuiz(1);
        helpers.sendSuccess(res, 200, 'msg')(results);
        next();
    } catch (e) {
        helpers.sendError(res, e.code)(e);
    }
});

module.exports = router
