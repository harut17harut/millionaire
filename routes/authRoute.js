let router = require("express").Router();
let validation = require("../validations/index")
let {authController} = require("../controllers/authController");
let isAuthorized = require("../middlewares/isAuthorized");
const isAdmin = require("../middlewares/isAdmin");

router.post('/signup',validation.signup,authController.signup);
router.post('/',validation.signin,authController.signin);

module.exports = router;