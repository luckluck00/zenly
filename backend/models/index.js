const webConfig = require('../config/WebConfig');
const dbConfig = webConfig.dbConfig;
const debug = webConfig.debug;
const DataTypes = require('sequelize');
const {Op} = require('sequelize');
const initModels = require('./init-models');
const sequelize = new DataTypes(dbConfig.DB, dbConfig.USER, dbConfig.CODE, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  logging: debug,
  // 時區不設定，故意的
  // dialectOptions: dbConfig.dialectOptions,
  // timezone: dbConfig.timezone,
});
const db = initModels(sequelize);
db.op = Op;
db.sequelize = sequelize;
module.exports = db;