
const { body,param } = require('express-validator');
let {authController} = require("../controllers/authController");

const signin = [
    body('username').notEmpty().withMessage('Field is required'),
    body('password').notEmpty().withMessage('Field is required')
];
const id = [
    param('id').custom(value => {
      return authController.getById(value).then(user => {
        if (!user.length) {
          return Promise.reject('User not found');
        }
        return false
      });}),
    ];
module.exports = {
    signin,
    id
}