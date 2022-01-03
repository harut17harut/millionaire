const { playController } = require("../controllers/playController");
const isAuthorized = require("../middlewares/isAuthorized");

let router = require("express").Router();

router.post("/",isAuthorized,playController.play);
module.exports = router;