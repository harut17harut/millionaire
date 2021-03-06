'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  questions.init({
    correct: DataTypes.INTEGER,
    answers: {
      type: DataTypes.JSON,
      allowNull:false,
    },
    question: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'questions',
  });
  return questions;
};