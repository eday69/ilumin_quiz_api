let router = require('express').Router()
let qry = require('./data/query');
let helpers = require('../helpers/common');

let { version: apiVersion } = require('../package')


router.get('/', (req, res, next) => {
  res.send(`Hi, this is Prompt API version ${apiVersion}`)
})

router.post('/prompt', async (req, res, next) => {

    var quizid = req.body.quizid;
    var student = req.body.student;
    var answers = req.body.answers;

    try {
        const results = await qry.savePrompt(quizid, student, answers);
        helpers.sendSuccess(res, 200, 'msg')(results);
        next();
    } catch (e) {
        helpers.sendError(res, e.code)(e);
    }
});

router.get('/prompt/:token', async (req, res, next) => {
    var token = req.params.token;

    try {
        const results = await qry.getPrompt(token);
        helpers.sendSuccess(res, 200, 'msg')(results);
        next();
    } catch (e) {
        helpers.sendError(res, e.code)(e);
    }
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
