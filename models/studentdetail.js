'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       StudentDetails.belongsTo(models.Student)
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