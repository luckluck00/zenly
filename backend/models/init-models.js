var DataTypes = require("sequelize").DataTypes;
var _member = require("./Member");

function initModels(sequelize) {
  var member = _member(sequelize, DataTypes);


  return {
    member,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
