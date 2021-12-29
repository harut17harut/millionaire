let router = require("express").Router();
let validation = require("../validations/signup")
let {authController} = require("../controllers/authController");

router.post('/signup',validation.create,authController.signup);
module.exports = router;