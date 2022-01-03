const { validationResult } = require('express-validator');
let userModel = require("../models/index").user;
let bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

class authController {
    //get user by username
    static getByUsername = async (username) => {
        let data = await userModel.findAll({ where: { username: username } });
        if (data.length) {
            return data;
        }
        else {
            return [];
        }

    }
    //get User by id
    static getById = async (id) => {
        let data = await userModel.findAll({ where: { id: id } });
        if (data.length) {
            return data;
        }
        else {
            return [];
        }
    }
    //signin action
    static signin = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let user = await authController.getByUsername(req.body.username);
        console.log(user);
        user = user[0];
        if (!user) {
            return res.status(403).json({
                code: 403,
                message: "Invalid username or password"
            });
        }

        let isValid = bcrypt.compareSync(req.body.password, user.password);//Password checking

        if (isValid) {
            let { JWT_SECRET } = process.env;
            let token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });//Generate jwt token
            return res.status(200).json({
                code: 200,
                data: {
                    token,
                    expireIn: 3600
                }
            })
        }
        return res.status(403).json({
            code: 403,
            message: "Invalid username or password"
        });

    }
    //signup action
    static signup = async (req, res) => {
        //validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.table(errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        //insert into DB
        try {
            let password = req.body.password.toString();
            let hash = bcrypt.hashSync(password, 5);
            let data = await userModel.create({ name: req.body.name, username: req.body.username, password: hash });
            return res.status(201).json(data);
        }
        catch (error) {
            console.error(error);
            return res.send(error)
        }
    }
    //Get full data of signed-in user
    static getActiveUser = async (username) => {
        let userData = await userModel.findAll({ where: { username: username } });
        if (userData.length) {
            return userData;
        }
        else {
            return [];
        }
    }
    //delete User by id
    static deleteUser = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let data = await userModel.destroy({ where: { id: req.params.id } });
            if (data) {
                res.status(201).json({ message: `User with id:${req.params.id} deleted succesfully` })
            }
        } catch (error) {
            res.json({ message: `Failed to Delete user with id:${req.params.id}` });
        }
    }

}
module.exports = { authController }