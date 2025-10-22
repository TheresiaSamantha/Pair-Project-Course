'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentDetail extends Model {
    get formatDate() {
      if (!this.dateOfBirth) {
        return "-"
      }
      return new Date(this.dateOfBirth).toISOString().split("T")[0]
    }
    static associate(models) {
      // define association here
      StudentDetail.belongsTo(models.Student)
    }
  }
  StudentDetail.init({
    address: DataTypes.STRING,
    ktm: DataTypes.INTEGER,
    grade: DataTypes.INTEGER,
    dateOfBirth: DataTypes.DATE,
    StudentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StudentDetail',
  });
  return StudentDetail;
};