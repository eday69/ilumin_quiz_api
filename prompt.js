require('dotenv').config()

let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

console.log('Machine:', process.env.API_DB_HOST, 'Port:', process.env.API_APP_PORT);
const options = {
  origin: "*",
  methods: ["GET","HEAD","PUT","PATCH","POST","DELETE"],
  credentials: true,
  maxAge: 3600
};

express()
  // .use(cors())
  .use(cors(options))
  .options(cors())

  .use(bodyParser.json({ strict: false }))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(require('./router'))
  .listen(process.env.API_APP_PORT)
