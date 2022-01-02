let authRouter = require("./authRoute");
let dashboardRouter = require("./dashboardRoute");
let playRoute = require("./playRoute");
let router = require("express").Router();
router.use("/auth",authRouter);
router.use("/dashboard",dashboardRouter);
router.use("/play",playRoute);
module.exports = router