const { validationResult } = require('express-validator');
let userModel = require("../models/index").user;
let scoresModel = require("../models/index").scores;
class statisticsController {
    //Get all scores action
    static getAllScores = async (req, res) => {
        let data = await scoresModel.findAll({attributes:['id','userid','score'],include:[{model:userModel,attributes:['username','name']}]});
        return res.status(200).json(data);
    }
    
}
module.exports = { statisticsController }