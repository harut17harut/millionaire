let router = require("express").Router();
let isAuthorized = require("../middlewares/isAuthorized");
let isAdmin = require("../middlewares/isAdmin");
let {dashController} = require("../controllers/dashController");

router.get("/questions",isAuthorized,isAdmin,dashController.getAllQuestions);
module.exports = router;