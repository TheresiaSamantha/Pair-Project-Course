'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.hasOne(models.StudentDetail)
      Student.belongsToMany(models.Course, { through: "StudentCourse", foreignKey: "StudentId" })
      Student.hasMany(models.StudentCourse, {
        foreignKey: "StudentId" 
      })
    }
  }
  Student.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Name is required" },
          notNull:  { msg: "Name is required" }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email already registered" },
        validate: {
          notEmpty: { msg: "Email is required" },
          notNull:  { msg: "Email is required" },
          isEmail:  { msg: "Email format is invalid" }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password is required" },
          notNull:  { msg: "Password is required" },
          len: {
            args: [6, 100],
            msg: "Password min 6 characters"
          }
        }
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "student"
      }
  }, {
    sequelize,
    modelName: 'Student',
  });

  Student.beforeCreate((student) => {
    student.role = "student"
  })
  
  return Student;
};