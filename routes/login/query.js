let db = require('../../db.js');
let build = require('./build');
let helpers = require('../../helpers/common');
let bcrypt = require('bcrypt');
let crypto = require('crypto');
let nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');

const getBaseRouteLogin = async function() {

  try {
    helpers.throwError(409, 'Request Error', 'Forbiden access')();
  } catch(e) {
    throw e;
  }
}

const emailExists = async function(email) {
sql = 'SELECT id ' +
      'FROM user ' +
      'WHERE email = ? ';

try {
  // Is that email taken?
  const checkEmail = await helpers.runQuery(db, sql, [email]);
  return (checkEmail.length > 0) ? checkEmail[0].id : '';
} catch(e) {
  console.log('We have an error in checkForEmail');
}
}

const deleteResetToken = async function(user_id) {
  sql = 'DELETE FROM reset_password ' +
        'WHERE user_id = ? ';

  try {
    const results = await helpers.runQuery(db, sql, [user_id]);
    return;

  } catch(e) {
    console.log('We have an error in deleteResetToken');
  }
}

const insertResetToken = async function(params) {
  sql = 'INSERT INTO reset_password ' +
        ' (user_id, access_token, date_created) ' +
        'VALUES (?, ?, CURRENT_TIMESTAMP)';

  try {
    const results = await helpers.runQuery(db, sql, [
      params.student_id,
      params.access_token
    ]);
    return true;

  } catch(e) {
    console.log('We have an error insertResetToken');
  }
}

const resetPassword =  async function(email) {
    try {
      if (!email) {
        helpers.throwError(500, 'request error', 'Email is required')();
      }
      const studentId = await emailExists(email);

      if (!studentId) {
        helpers.throwError(409, 'request error', 'Email does not exist')();
      }

      var params = {
        student_id: studentId,
        access_token: crypto.randomBytes(32).toString('hex')
      };

      // Delete token student_id/token from reset_password table
      await deleteResetToken(studentId);
      // Insert new access
      await insertResetToken(params);

      await helpers.prepareResponse(200, []);
      // Send email
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          // host: 'smtp.gmail.com',
          // port: 587,
          // secure: false,
          // port: 465,
          auth: {
            user: 'eric.ch.day@gmail.com',
            pass: 'przkrfpkzqcwddzn'
          }
      });

      let host = process.env.API_DB_HOST;
      let link = '';
      switch (host) {
        case "localhost":
          link = 'http://localhost:4200/';
          break;
        case "13.58.133.179":
          link = 'http://18.218.212.36:4201/';
          break;
        case "52.14.14.234":
          link = 'http://18.216.159.25/';
          break;
      }
      link = link + 'response-reset-password/';

      var mailOptions = {
          from: 'eric.ch.day_fake@gmail.com',
          to: email,
          subject: 'CollegeLlama Password Reset',
          text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          link + params.access_token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      let info = await transporter.sendMail(mailOptions);

    } catch(e) {
      throw e;
    }
}

const findStudentWithResetToken = async function(token) {
    sql = 'SELECT user_id ' +
          'FROM reset_password ' +
          'WHERE access_token = ? ';

    try {
      const student = await helpers.runQuery(db, sql, [token]);
      return (student.length > 0) ? student[0].user_id : '';
    } catch(e) {
      console.log('We have an error in findStudentWithResetToken');
    }
}

const findStudent = async function(studentId) {
    sql = 'SELECT user_id ' +
          'FROM student ' +
          'WHERE user_id = ? ';

    try {
      const isStudent = await helpers.runQuery(db, sql, [studentId]);
      return (isStudent.length > 0) ? isStudent[0].user_id : '';
    } catch(e) {
      console.log('We have an error in findStudent');
    }
}

const validToken =  async function(token) {
    try {
      if (!token) {
          helpers.throwError(500, 'request error', 'Token is required')();
      }
      const student = await findStudentWithResetToken(token);

      if (!student) {
        helpers.throwError(404, 'request error', 'Invalid Token')();
      }

      const studentId = await findStudent(student);

      if (!studentId) {
        helpers.throwError(500, 'request error', 'User error')();
      }

      return await helpers.prepareResponse(200, [{msg: 'Token verified'}]);

    } catch(e) {
      throw e;
    }
}

const newPassword =  async function(token, pwd) {
    try {
      const student = await findStudentWithResetToken(token);
      if (!student) {
          helpers.throwError(409, 'request error', 'Token is expired')();
      }

      const studentId = await findStudent(student);
      if (!studentId) {
        helpers.throwError(500, 'request error', 'User does not exist')();
      }
      salt = bcrypt.genSaltSync(10);
      await updateUserPassword(student, salt, bcrypt.hashSync(pwd, salt));

      return await helpers.prepareResponse(200, [{msg: 'Password changed'}]);

    } catch(e) {
      throw e;
    }
}

const updateUserPassword = async function(studentId, salt, hash) {
    sql = 'UPDATE user ' +
          'SET salt = ?, ' +
              'hash = ? ' +
          'WHERE id = ?  ';

    try {
      const results = await helpers.runQuery(db, sql, [salt, hash, studentId]);
      return true;
    } catch(e) {
      console.log('We have an error updateUserPassword');
    }
}

const validateLogin = async function(email, password) {
    sql = 'SELECT id, name, hash ' +
          'FROM user ' +
          'WHERE email = ? ';

    try {
      const results = await helpers.runQuery(db, sql, [email]);
      const row = results[0];
      db_password = row ? row.hash : '';
      if (!db_password) {
        helpers.throwError(404, 'request error', 'User not found')();
      }

      data = [];
      if (bcrypt.compareSync(password, db_password)) {
          let token = jwt.sign({email: email}, process.env.JWT_KEY, { expiresIn: '30d' });

          results.forEach(function(res) {
            data.push(
              build.build_login(
                token,
                row.name,
                row.id
              )
            );
          });
        return await helpers.prepareResponse(200, data);

      } else {
        helpers.throwError(404, 'request error', 'Wrong credentials')();
      }
    } catch(e) {
      throw e;
    }
}

const generateNewUser = async function(params) {
   sql = 'INSERT INTO user ' +
        '(name, email, hash, salt) '   +
        'VALUES (?, ?, ?, ?)';

    try {
      salt = bcrypt.genSaltSync(10);

      const results = await helpers.runQuery(db, sql, [
        params.name,
        params.email,
        bcrypt.hashSync(params.password, salt),
        salt
      ]);
      return results;
    } catch(e) {
      throw e;
    }
}

const registerUser = async function(params) {

    try {
      const emailInUse = await emailExists(params.email);

      if (emailInUse) {
        helpers.throwError(409, 'request error', 'Email already taken')();
      }
      results = await generateNewUser(params);

      return await helpers.prepareResponse(200, []);
    } catch(e) {
      throw e;
    }
}

module.exports = {
getBaseRouteLogin,
validateLogin,
registerUser,
resetPassword,
validToken,
newPassword,
}
