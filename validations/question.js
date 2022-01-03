
const { body,param } = require('express-validator');
const { dashController } = require('../controllers/dashController');
//question creation validations
const create = [
    body('correct').notEmpty().withMessage('Field is required').isNumeric().withMessage("Please enter numeric value"),
    body('answers').notEmpty().withMessage('Field is required').isArray().notEmpty().withMessage("This value must be Array").custom(value => {
        let isArray = Array.isArray(value);
          if (!isArray) {
            throw new Error('Value must be a array');
          }else if(value.length!=4){
            throw new Error('Array must contain 4 variants');
          }
          return true
        }),
    body('question').notEmpty().withMessage('Field is required')
];
//find question by id for middleware checks
const id = [
param('id').custom(value => {
  return dashController.getById(value).then(user => {
      //console.log(user);
    if (!user.length) {
      return Promise.reject('Question not found');
    }
    return false
  });}),
];
module.exports = {
    create,
    id
}