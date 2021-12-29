
const { body } = require('express-validator');
let {authController} = require("../controllers/authController")
const signin = [
    body('username').notEmpty().withMessage('Field is required'),
    body('password').notEmpty().withMessage('Field is required')
];

module.exports = {
    signin
}