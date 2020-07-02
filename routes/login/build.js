
function build_login (token, name, student_id) {
  return {
    studentId: student_id,
    token: token,
    name: name,
   }
}

module.exports = {
  build_login,
}
