let { dashController } = require("../controllers/dashController");
let scoresModel = require("../models/index").scores;
let userModel = require("../models/index").user;
const jwt = require('jsonwebtoken');
let fs = require("fs");

class playController {
    static play = async (req, res) => {
        let { JWT_SECRET } = process.env;
        let authorization = req.body.authorization.split(".")[0];
        let fileExists = fs.existsSync(__dirname + "/../gamestats/" + authorization + ".txt");
        if (!fileExists) {
            let questions = await dashController.getAllQuestRandom();
            let currentIndex = 0;
            let score = 0;
            let hint50 = 1;
            let question = questions[currentIndex];
            question.answers = JSON.parse(question.answers);
            let token = jwt.sign({ currentIndex: currentIndex, questions: questions, score: score, hint50 }, JWT_SECRET);
            fs.writeFileSync(__dirname + "/../gamestats/" + authorization + ".txt", token);
            return res.json({ welcome: `Welcome to millionaire,you have ${hint50} 50/50  help`, question: question.question, answers: question.answers });
        }
        else {
            let { userId, username } = req.body;
            let token = fs.readFileSync(__dirname + "/../gamestats/" + authorization + ".txt", "utf-8");
            let data;
            let err;
            jwt.verify(token, JWT_SECRET, (error, decoded) => {
                if (error) {
                    err = "Token has expirerd";
                    return;
                }
                else {
                    data = decoded;
                }
            });
            if (err) {
                fs.unlinkSync(__dirname + "/../gamestats/" + authorization + ".txt")
                return res.status(403).json({ message: err });
            }

            let currentIndex = data.currentIndex;
            let questions = data.questions;
            let score = data.score;
            let question = questions[currentIndex];
            let hint50 = data.hint50;
            if (req.body.hint) {
                if (req.body.hint == "50/50") {
                    if (hint50 == 0) {
                        return res.json({ message: "You have no 50/50 hint avilable" });
                    } else {
                        if (req.body.answer) {
                            return res.json({ message: "please delete answer before using hint" });
                        }
                        question.answers = JSON.parse(JSON.stringify(question.answers));
                        let answers = playController.help50(question.answers, question.correct);
                        hint50--;
                        let token = jwt.sign({ currentIndex: currentIndex, questions: questions, score: score, hint50 }, JWT_SECRET);
                        fs.writeFileSync(__dirname + "/../gamestats/" + authorization + ".txt", token);
                        return res.json({ question: question.question, answers: answers });
                    }
                }
            }
            if (currentIndex < questions.length - 1) {
                let { answer } = req.body;
                if (!answer) {
                    return res.send("Please fill answer field [1-4]")
                }
                try {
                    if (answer == question.correct + 1) {
                        score++;
                        currentIndex = data.currentIndex + 1;
                        let token = jwt.sign({ currentIndex: currentIndex, questions: questions, score: score, hint50 }, JWT_SECRET);
                        fs.writeFileSync(__dirname + "/../gamestats/" + authorization + ".txt", token);
                        question = questions[currentIndex];
                        question.answers = JSON.parse(question.answers);
                        return res.json({ question: question.question, answers: question.answers });
                    }
                    else {
                        score = score * 10;
                        let data = await scoresModel.create({ userid: userId, score: score });
                        if (data) {
                            fs.unlinkSync(__dirname + "/../gamestats/" + authorization + ".txt")
                            return res.send(`Game over dear ${username} your score is ${score}`);
                        }
                    }
                } catch (error) {
                    res.send(error);
                }
            }
            else if (currentIndex >= questions.length - 1) {
                score++;
                score = score * 10;
                console.log(score);
                let data = await scoresModel.create({ userid: userId, score: score });
                if (data) {
                    fs.unlinkSync(__dirname + "/../gamestats/" + authorization + ".txt")
                    return res.send(`You Win dear ${username} your score is ${score}`);
                }
            }
        }
    }
    static help50 = function (answers, correct) {
        [answers[correct], answers[3]] = [answers[3], answers[correct]];
        answers[0] = "Wrong";
        answers[1] = "Wrong";
        [answers[correct], answers[3]] = [answers[3], answers[correct]];
        return answers;
    }

    static getUserScore = async (req, res) => {
        let { userId } = req.body;
        let data = await scoresModel.findAll({ include: [{ model: userModel, attributes: ['username', 'name'] }], attributes: ['score'], where: { userId: userId } });
        if (data.length) {
            return res.json(data);
        }
        else {
            return res.json({ message: "You have no scores yet" });
        }
    }

    static getBestScore = async (req, res) => {
        let data = await scoresModel.findAll({ include: [{ model: userModel, attributes: ['username', 'name'] }], attributes: ['score'], limit: 10, order: [['score', 'DESC']] });
        if (data.length) {
            return res.json(data);
        }
        else {
            return res.json({ message: "Not avilable scores yet" });
        }
    }
}

module.exports = { playController };