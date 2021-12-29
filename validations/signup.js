
const { body } = require('express-validator');
let {authController} = require("../controllers/authController")
const create = [
    body('name')
        .notEmpty().withMessage('Field is required')
        .isLength({ min: 3 }).withMessage('Min lenght is 3 character'),
    body('username').notEmpty().withMessage('Field is required').custom(value => {
        return authController.getByUsername(value).then(user => {
            console.log(user);
          if (user.length) {
            return Promise.reject('Username already in use');
          }
          return false
        });}),
    body('password').notEmpty().withMessage('Field is required')
];

module.exports = {
    create
}