"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  student.init(
    {
      fullname: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      parentName: DataTypes.STRING,
      parentNumber: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "student",
    }
  );
  return student;
};
