let authRouter = require("./authRoute");
let dashboardRouter = require("./dashboardRoute");
let playRoute = require("./playRoute");
let router = require("express").Router();
const isAuthorized = require("../middlewares/isAuthorized");
const { playController } = require("../controllers/playController");

router.use("/auth",authRouter);
router.use("/dashboard",dashboardRouter);
router.use("/play",playRoute);
router.get("/myscore",isAuthorized,playController.getUserScore);
router.get("/bestscores",isAuthorized,playController.getBestScore);
module.exports = router