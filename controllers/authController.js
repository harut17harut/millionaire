const { validationResult } = require('express-validator');
let userModel = require("../models/index").user;
let bcrypt = require("bcrypt");

class authController {
    static getByUsername = async (username) => {
        let data = await userModel.findAll({where:{username:username}});
        if(data.length){
            return data;
        }
        else{
            return [];
        }
        
    }

    static signup = async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.table(errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let hash = bcrypt.hashSync(req.body.password, 5);
            let data = await userModel.create({ name: req.body.name, username: req.body.username, password: hash });
            return res.status(201).json(data);
        }
        catch (error) {
            console.error(error);
            return res.send(error)
        }
    }
}
module.exports = { authController }