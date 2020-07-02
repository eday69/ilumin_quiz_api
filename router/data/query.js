let db = require('../../helpers/db.js');
let build = require('./build');
let helpers = require('../../helpers/common');
// let bcrypt = require('bcrypt');
let crypto = require('crypto');
// let nodemailer = require('nodemailer');

const savePrompt = async function(body) {
    sql = 'INSERT INTO quizzes ' +
 				  '(first_name, last_name, email, highschool, city, year_graduate, ' +
          'answers, token ) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?) ';
    try {
      var token = crypto.randomBytes(64).toString('hex');
      const results = await helpers.runQuery(db, sql,
        [
          body.firstname,
          body.lastname,
          body.email,
          body.highschool,
          body.city,
          body.yeargraduate,
          body.answers,
          token
        ]);

        return await helpers.prepareResponse(200, [ { token }]);

      } catch(e) {
        throw e;
      }
}

function getTop4Answers(answers) {
    const answerArray = [].concat.apply([], JSON.parse(answers));
    var s = answerArray.reduce(function(m, v){
      m[v] = (m[v] || 0) + 1; return m;
    }, {});

    var a = [];

    for (k in s) a.push({ k:k, n:s[k] });

    a.sort(function(a, b){ return b.n - a.n });
    a = a.map(function(a) { return a.k }).slice(0,4);

    return a;
}

const getPrompt = async function(token) {
    sql = 'SELECT first_name, last_name, answers ' +
          'FROM quiz ' +
          'WHERE token = ? ';
    // salt = bcrypt.genSaltSync(10);
    try {
      const results = await helpers.runQuery(db, sql, [token]);

      results.forEach(function(res) {
        console.log('Results', res);
        const answers = getTop4Answers(res.answers)

        console.log('Occurrance', answers);
      });

      return await helpers.prepareResponse(200, [ { token }]);

    } catch(e) {
      throw e;
    }
}

const getQuiz = async function(quiz) {
    sql = 'SELECT qq.question_num, qq.question_name, qq.label, qq.content, ' +
	        'GROUP_CONCAT(CONCAT_WS("|^|", qqo.name, qqo.prompt_ref) separator "|#|") as options ' +
          'FROM quiz q ' +
          'INNER JOIN quiz_question qq ON qq.quiz_id = q.id ' +
          'INNER JOIN quiz_question_options qqo ON qqo.quiz_id = q.id ' +
          '   AND qqo.quiz_question_id = qq.id ' +
          'WHERE q.id = ? ' +
          'GROUP BY qq.question_num, qq.question_name, qq.label, qq.content' ;

    try {
        const results = await helpers.runQuery(db, sql, [quiz]);
        data = [];
        results.forEach(function(res) {
            data.push(build.build_question(res));
        });
        return await helpers.prepareResponse(200, data);
    } catch(e) {
      throw e;
    }
}


module.exports = {
  getPrompt,
  getQuiz,
  savePrompt,
}
