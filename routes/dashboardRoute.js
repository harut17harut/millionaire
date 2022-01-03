let router = require("express").Router();
let isAuthorized = require("../middlewares/isAuthorized");
let isAdmin = require("../middlewares/isAdmin");
let {dashController} = require("../controllers/dashController");
let {statisticsController} = require("../controllers/statisticsController");
let validation = require("../validations/index");
const { authController } = require("../controllers/authController");

router.get("/questions",isAuthorized,isAdmin,dashController.getAllQuestions);//get app questions
router.get("/statistics",isAuthorized,isAdmin,statisticsController.getAllScores);//get all scores
router.post("/questions/add",isAuthorized,isAdmin,validation.question.create,dashController.createQuestion);//create question
router.post("/questions/edit/:id",isAuthorized,isAdmin,validation.question.id,validation.question.create,dashController.editQuestion);//question edit
router.post("/questions/delete/:id",isAuthorized,isAdmin,validation.question.id,dashController.deleteQuestion);//delete question
router.post("/users/delete/:id",isAuthorized,isAdmin,validation.signin.id,authController.deleteUser);//delete user
module.exports = router;