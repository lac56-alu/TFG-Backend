const { DB, USER, PASSWORD, HOST, dialect, pool } = require("../config/database.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect,
  pool,
});

module.exports = sequelize;

