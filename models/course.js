'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsToMany(models.Student, { through: "StudentCourse", foreignKey: "CourseId" })
      Course.hasMany(models.StudentCourse, {
        foreignKey: "CourseId" 
      })

      Course.belongsTo(models.Category)
    }

    static async notif() {
      return await Course.findAll({
        attributes: [
          [this.sequelize.fn("COUNT", this.sequelize.col("id")), "total"]
        ]
      })
    }
  }
  Course.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Name is required" },
          notNull:  { msg: "Name is required" }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Description is required" },
          notNull:  { msg: "Description is required" },
          len: {
            args: [10, 5000],
            msg: "Description min 10 characters"
          }
        }
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Duration is required" },
          notNull:  { msg: "Duration is required" },
          isInt:    { msg: "Duration must be an integer" },
          min: {
            args: [1],
            msg: "Duration must be ≥ 1"
          }
        }
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Category is required" },
          notNull:  { msg: "Category is required" },
          isInt:    { msg: "Category is invalid" }
        }
      }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};