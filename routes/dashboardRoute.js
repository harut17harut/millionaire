let router = require("express").Router();
let isAuthorized = require("../middlewares/isAuthorized");
let isAdmin = require("../middlewares/isAdmin");
let {dashController} = require("../controllers/dashController");
let {statisticsController} = require("../controllers/statisticsController");
let validation = require("../validations/index");
const { authController } = require("../controllers/authController");

router.get("/questions",isAuthorized,isAdmin,dashController.getAllQuestions);
router.get("/statistics",isAuthorized,isAdmin,statisticsController.getAllScores);
router.post("/questions/add",isAuthorized,isAdmin,validation.question.create,dashController.createQuestion);
router.post("/questions/edit/:id",isAuthorized,isAdmin,validation.question.id,validation.question.create,dashController.editQuestion);
router.post("/questions/delete/:id",isAuthorized,isAdmin,validation.question.id,dashController.deleteQuestion);
router.post("/users/delete/:id",isAuthorized,isAdmin,validation.signin.id,authController.deleteUser);
module.exports = router;