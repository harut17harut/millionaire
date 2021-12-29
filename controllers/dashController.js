const { validationResult } = require('express-validator');
let questionsModel = require("../models/index").questions;
let bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

class dashController {
static getAllQuestions = async (req,res)=>{
    let data = await questionsModel.findAll();
    return res.status(200).json(data);
}

}
module.exports = {dashController};