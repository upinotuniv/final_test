"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class student_grade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      student_grade.belongsTo(models.student, {
        foreignKey: "studentID",
      });
      student_grade.belongsTo(models.grade, {
        foreignKey: "gradeID",
      });
    }
  }
  student_grade.init(
    {
      studentID: DataTypes.INTEGER,
      gradeID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "student_grade",
    }
  );
  return student_grade;
};
