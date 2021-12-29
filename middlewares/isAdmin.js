let {authController} = require("../controllers/authController");

module.exports = async (req, res, next) => {

    let user = await authController.getActiveUser(req.body.username);
    user = user[0];
    console.log(user);
    if (user.role_id != "2") {
        return res.status(406).json({ message: "Only admin have access to this action" })
    }
    return next();
}