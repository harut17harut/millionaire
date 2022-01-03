let router = require("express").Router();
let validation = require("../validations/index")
let {authController} = require("../controllers/authController");
let isAuthorized = require("../middlewares/isAuthorized");
const isAdmin = require("../middlewares/isAdmin");

router.post('/signup',validation.signup.create,authController.signup);//signup router
router.post('/',validation.signin.signin,authController.signin);//signin router

module.exports = router;