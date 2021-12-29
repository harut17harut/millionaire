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
      type: DataTypes.TEXT,
           get: function() {
              return JSON.parse(this.getDataValue('answers'));
          },
          set: function(value) {
             this.setDataValue('value', JSON.stringify(value));
          },
    },
    question: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'questions',
  });
  return questions;
};