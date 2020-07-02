const mysql = require('mysql');

var db = mysql.createPool({
	connectionLimit: 10,
	host:process.env.API_DB_HOST,
	port:process.env.API_DB_PORT,
	user:process.env.API_DB_USER,
	password:process.env.API_DB_PASSWORD,
	database:process.env.API_DB_NAME
})

db.getConnection((err, connection) => {

	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('Database connection was closed');
		}

		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has too many connections');
		}

		if (err.code === 'ECONNREFUSED') {
			console.error('Database connection was refused');
		}
	}

	//now we release the connection
	if (connection)
		connection.release()

	return
})

module.exports = db
