const { validationResult } = require('express-validator');
let questionsModel = require("../models/index").questions;
let bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
let Sequelize = require("sequelize");

class dashController {
    static getAllQuestions = async (req, res) => {
        let data = await questionsModel.findAll();
        return res.status(200).json(data);
    }
    static getAllQuestRandom = async () => {
        let data = await questionsModel.findAll({ order: Sequelize.literal('rand()'),limit:3});
        return data;
    }
    static getById = async (id) => {
        let data = await questionsModel.findAll({where:{id:id}});
        if(data.length){
            return data;
        }
        else{
            return [];
        }
    }

    static createQuestion = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let answers = req.body.answers.join();
            let data = await questionsModel.create({ correct: req.body.correct, answers: answers.split(","), question: req.body.question });
            if (data) {
                res.status(201).json({ message: "New question added succesfully" })
            }
        } catch (error) {
            res.json({ message: "Failed to add question" });
        }
    }

    static editQuestion = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let answers = req.body.answers.join();
            let data = await questionsModel.update({ correct: req.body.correct, answers: answers.split(","), question: req.body.question },{where:{id:req.params.id}});
            if (data) {
                res.status(201).json({ message: `Question with id:${req.params.id} edited succesfully` })
            }
        } catch (error) {
            res.json({ message: `Failed to Edit question with id:${req.params.id}` });
        }
    }
    static deleteQuestion = async(req,res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let data = await questionsModel.destroy({where:{id:req.params.id}});
            if (data) {
                res.status(201).json({ message: `Question with id:${req.params.id} deleted succesfully` })
            }
        } catch (error) {
            res.json({ message: `Failed to Delete question with id:${req.params.id}` });
        }
    }
}
module.exports = { dashController };