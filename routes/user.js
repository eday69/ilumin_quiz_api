const path = require('path');

let router = require('express').Router()
let qry = require('./user/query');
let helpers = require('../helpers/common');

/**
 * Base Route for Users
 * GET /user
 */
router.get('/', async (req, res, next) => {
    try {
        const results = await qry.getBaseRouteUsers();
        helpers.sendSuccess(res, 200, 'msg')(results);
    } catch (e) {
      helpers.sendError(res, e.code)(e);
    }
});

/**
 * Get Basic Student Info
 * GET /user/:studentId
 */
router.get('/profile/:studentId', async (req, res, next) => {
    var studentId = req.params.studentId;

    try {
        const results = await qry.getProfile(studentId);
        helpers.sendSuccess(res, 200, 'msg')(results);
        next();
    } catch (e) {
        helpers.sendError(res, e.code)(e);
    }
});

/**
 * Save student general profile.
 * POST /user/profile
 */
router.post('/profile/:studentId', async (req, res, next) => {

  var params = req.body;
  var studentId = req.params.studentId;

  try {
      if (!('sat_score' in params)) params['sat_score'] = null;
      if (!('act_score' in params)) params['act_score'] = null;
      if (!('gpa' in params)) params['gpa'] = null;
      const results = await qry.postProfile(studentId, params);
      helpers.sendSuccess(res, 200, 'msg')(results);

      next();
  } catch (e) {
      helpers.sendError(res, e.code)(e);
  }
});

/**
 * Update User info
 * PUT /user/:student
 */
router.put('/profile/:studentId', async (req, res, next) => {

  try {

      var studentId = req.params.studentId;
      var param = {
        address: req.body.address,
        city: req.body.city,
        stateId: req.body.stateId,
        zip: req.body.zip,
        date_of_birth: helpers.formatDate(req.body.dateOfBirth),
        name: req.body.name,
        highschool_name: req.body.highschool_name,
        personality: req.body.personality,
        act: ('act' in req.body) ? req.body.act : null,
        sat: ('sat' in req.body) ? req.body.sat : null,
        gpa: ('gpa' in req.body) ? req.body.gpa : null
      }
      const results = await qry.putProfile(studentId, param);
      helpers.sendSuccess(res, 200, 'msg')(results);
  } catch (e) {
      helpers.sendError(res, e.code)(e);
  }
});

/**
 * Search Course
 * POST /user/course
 */
router.post('/course', async (req, res, next) => {
  var search_value = '%' + req.body.searchValue + '%';
  var student_id = req.body.studentId;

  try {
      const results = await qry.searchCourse(student_id, search_value);
      helpers.sendSuccess(res, 200, 'msg')(results);
  } catch (e) {
    helpers.sendError(res, e.code)(e);
  }
});

/**
 * Get Student Courses
 * GET /user/:studentId/courses
 */
router.get('/:studentId/courses', async (req, res, next) => {
    var studentId = req.params.studentId;

    try {
        const results = await qry.getUserCourses(studentId);
        helpers.sendSuccess(res, 200, 'msg')(results);
    } catch (e) {
      helpers.sendError(res, e.code)(e);
    }
});

/**
 * Insert User Course and Score
 * POST /user/:student/course
 */
router.post('/:studentId/course', async (req, res, next) => {

    param = {
    	student_id: req.body.data.student_id,
      course_id: req.body.data.course_id,
    	grade_sem_1: req.body.data.grade_sem_1,
      grade_sem_2: req.body.data.grade_sem_2,
    }

    try {
        const results = await qry.insertUserCourseScore(param);
        helpers.sendSuccess(res, 200, 'msg')(results);
    } catch (e) {
      helpers.sendError(res, e.code)(e);
    }
});

/**
 * Delete User Course
 * DELETE /user/:student/course/:id
 */
router.delete('/:studentId/course/:id', async (req, res, next) => {
    var student_id = req.params.studentId;
    var id = req.params.id;

    try {
        const results = await qry.deleteUserCourseScore(student_id, id);
        helpers.sendSuccess(res, 200, 'msg')(results);
    } catch (e) {
      helpers.sendError(res, e.code)(e);
    }
});

/**
 * Search Activity
 * POST /user/activity
 */
router.post('/activity', async (req, res, next) => {
  var search_value = '%' + req.body.searchValue + '%';
  var student_id = req.body.studentId;

  try {
      const results = await qry.searchActivity(student_id, search_value);
      helpers.sendSuccess(res, 200, 'msg')(results);
  } catch (e) {
    helpers.sendError(res, e.code)(e);
  }
});

/**
 * Get Student Activities
 * GET /user/:studentId/activities
 */
router.get('/:studentId/activities', async (req, res, next) => {
    var studentId = req.params.studentId;

    try {
        const results = await qry.getUserActivities(studentId);
        helpers.sendSuccess(res, 200, 'msg')(results);
    } catch (e) {
      helpers.sendError(res, e.code)(e);
    }
});

/**
 * Insert User Activity
 * POST /user/:student/activity
 */
router.post('/:studentId/activity', async (req, res, next) => {

    param = {
    	student_id: req.body.data.student_id,
      activity_id: req.body.data.activity_id,
    	hours_week: req.body.data.hours_per_week,
      weeks_year: req.body.data.weeks_per_year,
      years: req.body.data.years
    }

    try {
        const results = await qry.insertUserActivity(param);
        helpers.sendSuccess(res, 200, 'msg')(results);
    } catch (e) {
      helpers.sendError(res, e.code)(e);
    }
});

/**
 * Delete User Activity
 * DELETE /user/:student/activity/:id
 */
router.delete('/:studentId/activity/:id', async (req, res, next) => {
    var student_id = req.params.studentId;
    var id = req.params.id;

    try {
        const results = await qry.deleteUserActivity(student_id, id);
        helpers.sendSuccess(res, 200, 'msg')(results);
    } catch (e) {
      helpers.sendError(res, e.code)(e);
    }
});

/**
 * Insert/Update User Temp Key
 * PUT /user/:studentId/tempkey
 */
router.put('/:studentId/tempkey', async (req, res, next) => {
  var student_id = req.params.studentId;
  var key_text = req.body.keyText;
  var value = req.body.keyValue;

  try {
      const results = await qry.setKeyText(student_id, key_text, value);
      helpers.sendSuccess(res, 200, 'msg')(results);
  } catch (e) {
    helpers.sendError(res, e.code)(e);
  }
});

/**
 * Get User Temp Key Info
 * POST /user/:studentId/tempkey
 */
router.post('/:studentId/tempkey', async (req, res, next) => {
  var student_id = req.params.studentId;
  var key_text = req.body.keyText;
  try {
      const results = await qry.getKeyText(student_id, key_text);
      helpers.sendSuccess(res, 200, 'msg')(results);
  } catch (e) {
    helpers.sendError(res, e.code)(e);
  }
});

module.exports = router;
