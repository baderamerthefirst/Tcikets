require('dotenv').config(); // Load environment variables from .env file

const oracledb = require('oracledb');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`,
};

module.exports = {
  oracledb,
  dbConfig,
};
