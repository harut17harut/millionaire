let jwt = require("jsonwebtoken");
let {authController} = require("../controllers/authController");
module.exports = async (req, res, next) => {
    
    const { authorization, accept } = req.headers;
    let errorMessage = [];
    if (!authorization) {
        errorMessage.push("header authorization is missing");
    }
    if (authorization && !authorization.includes("Bearer ")) {
        errorMessage.push("Token key must contain bearer");
    }
    if (!accept) {
        errorMessage.push("Header accept is missing");
    }
    if (accept != 'application/json') {
        errorMessage.push("header accepts only application/json");
    }
    if (errorMessage.length) {
        
        return res.status(403).json({ message: errorMessage });
    }
    let bearerToken = authorization.split(' ')[1];
    if (bearerToken) {
        
        try {
            let { JWT_SECRET } = process.env;
            let data = jwt.verify(bearerToken, JWT_SECRET);
            
            if (data && data.hasOwnProperty('username')) {
                let DBUser = await authController.getByUsername(data.username);
                DBUser = DBUser[0];
                console.log(!DBUser.hasOwnProperty("username"));
                if (!DBUser) {
                    return res.status(403).json({ message: "A User of given token not found" });
                }
                req.body.userId = data.id;
                req.body.username = data.username;
                return next();
            }
        }
        catch (error) {
            throw error
         }
    }
    return res.status(403).json({ code: 403, message: "UNAUTHORIZED" });
};