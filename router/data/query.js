let db = require('../../helpers/db.js');
let build = require('./build');
let helpers = require('../../helpers/common');
let crypto = require('crypto');
let nodemailer = require('nodemailer');


function sendResults(email, name, token) {
    try {
      // Send email
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          // host: 'smtp.gmail.com',
          // port: 587,
          // secure: false,
          // port: 465,
          auth: {
            user: process.env.EMAIL_TRANSPORTER,
            pass: process.env.EMAIL_TRANSPORTER_PWD
          }
      });

      let host = process.env.API_DB_HOST;
      let url = '';
      switch (host) {
        case "localhost":
          url = 'http://localhost:4200/answers/';
          break;
        case "13.58.133.179":
          url = 'http://18.218.212.36:4201/answers/';
          break;
        case "52.14.14.234":
          url = 'http://18.216.159.25/answers/';
          break;
      }
      var quiz_date = new Date().toJSON().slice(0,10).replace(/-/g,'/');

      var mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'You have completed: Which 4 UC Prompts Are Best For You?',
          text: 'You have submitted:\n\n' +
          'Which 4 UC Prompts Are Best For You?\n\n' +
          'Name: ' + name + '\n\n' +
          'Date Submitted: ' + quiz_date + '\n\n' +
          'Your result: ' + url + token
      }
      let info = transporter.sendMail(mailOptions);

    } catch(e) {
      throw e;
    }
}

const savePrompt = async function(quizid, student, answers) {
    sql = 'INSERT INTO quiz_answers ' +
 				  '(quiz_id, first_name, last_name, email, highschool, city, year_graduate, ' +
          'answers, token ) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ';
    try {
      var token = crypto.randomBytes(64).toString('hex');
      const results = await helpers.runQuery(db, sql,
        [
          quizid,
          student.firstname,
          student.lastname,
          student.email,
          student.highschool,
          student.city,
          student.yeargraduate,
          answers,
          token
        ]);
        var name = student.firstname + ' ' + student.lastname;
        sendResults(student.email, name, token);

        return await helpers.prepareResponse(200, { token });

      } catch(e) {
        throw e;
      }
}

function getTop4Prompts(answers) {
    const answerArray = [].concat.apply([], JSON.parse(answers));
    var s = answerArray.reduce(function(m, v){
      if (v) {
          m[v] = (m[v] || 0) + 1;
      }
      return m;
    }, {});

    var a = [];

    for (k in s) a.push({ k:k, n:s[k] });

    a.sort(function(a, b){ return b.n - a.n });
    a = a.map(function(a) { return a.k }).slice(0,4);

    return a;
}

const findAPrompt = async function(answer) {
    sql = 'SELECT qq.question_name, qpp.intro, qpp.prompt ' +
          'FROM quiz_prompts_prompt as qpp ' +
          'INNER JOIN quiz_prompts AS qp ON qp.id = qpp.quiz_prompts_id ' +
          'INNER JOIN quiz_question AS qq ON qq.id = qp.quiz_question_id ' +
          'WHERE qq.id = ? ' +
          '  AND qpp.quiz_question_id = qq.id ';

    try {
      const item_prompt = await helpers.runQuery(db, sql, [answer]);
      info = [];
      item_prompt.forEach(p => {
        info.push(build.build_prompt(p))
      });
      return info;
    } catch(e) {
      console.log('We have an error in findAPrompt');
    }
}

const findAnswers = async function(selected) {
    sql = 'SELECT qq.id, qq.question_name, qp.intro, qp.extra ' +
          'FROM  quiz AS q ' +
          'INNER JOIN quiz_question AS qq ON qq.quiz_id = q.id ' +
          'INNER JOIN quiz_prompts AS qp ON qp.quiz_question_id = qq.id ' +
          'WHERE  q.id = 1 ' +
          '  AND  qq.question_num in (?) ' +
          'ORDER BY FIELD(qq.question_num, ?) ';

    try {
      const found = await helpers.runQuery(db, sql, [selected, selected]);
      data = [];
      for (const item of found) {
          const listPrompts = await findAPrompt(item.id);
          data.push(build.build_prompts(item, listPrompts));
      };

      return data;
    } catch(e) {
      console.log('We have an error in findAnswers');
    }
}

const getPrompt = async function(token) {
    sql = 'SELECT first_name, last_name, answers ' +
          'FROM quiz_answers ' +
          'WHERE token = ? ';
    try {
      const results = await helpers.runQuery(db, sql, [token]);

      let data = {};
      for (const res of results) {
          const top = getTop4Prompts(res.answers)
          const prompts = await findAnswers(top);
          const quizData = await getQuizData(1);

          data = build.build_answer(prompts, res, quizData, top);
      };

      return Object.keys(data).length === 0 && data.constructor === Object ? await helpers.prepareResponse(204, []) : await helpers.prepareResponse(200, data);

    } catch(e) {
      throw e;
    }
}

const getQuizData = async function(quiz) {
    sql = 'SELECT qq.question_num, qq.question_name, qq.label, qq.content, ' +
          '(SELECT GROUP_CONCAT(CONCAT_WS("|^|", qqo.name, qqo.prompt_ref) separator "|#|") ' +
          'FROM quiz_question_options qqo  ' +
          'WHERE qqo.quiz_id = q.id AND qqo.quiz_question_id = qq.id  ' +
          'ORDER BY qqo.id ASC) as options ' +
          'FROM quiz q ' +
          'INNER JOIN quiz_question qq ON qq.quiz_id = q.id ' +
          'INNER JOIN quiz_question_options qqo ON qqo.quiz_id = q.id ' +
          '   AND qqo.quiz_question_id = qq.id ' +
          'WHERE q.id = ? ' +
          'GROUP BY qq.question_num, qq.question_name, qq.label, qq.content, options' ;

    try {
        const results = await helpers.runQuery(db, sql, [quiz]);
        data = [];
        results.forEach(function(res) {
            data.push(build.build_question(res));
        });
        return data;
    } catch(e) {
      throw e;
    }
}

const getQuiz = async function(quiz) {
    const data = await getQuizData(quiz);
    return await helpers.prepareResponse(200, data);
}

module.exports = {
  getPrompt,
  getQuiz,
  savePrompt,
}
