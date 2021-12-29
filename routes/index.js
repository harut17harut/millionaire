let authRouter = require("./authRoute");
let dashboardRouter = require("./dashboardRoute");
let router = require("express").Router();
router.use("/auth",authRouter);
router.use("/dashboard",dashboardRouter);
module.exports = router