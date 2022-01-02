let { dashController } = require("../controllers/dashController");
let scoresModel = require("../models/index").scores;
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
            let question = questions[currentIndex];
            question.answers = JSON.parse(question.answers);
            let token = jwt.sign({ currentIndex: currentIndex, questions: questions, score: score }, JWT_SECRET);
            fs.writeFileSync(__dirname + "/../gamestats/" + authorization + ".txt", token);
            return res.json({ question: question.question, answers: question.answers });
        }
        else {
            let { userId } = req.body;
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

            if (currentIndex < questions.length - 1) {
                let { answer } = req.body;
                if (!answer) {
                    return res.send("Please fill answer field [1-4]")
                }
                try {
                    if (answer == question.correct + 1) {
                        score++;
                        currentIndex = data.currentIndex + 1;
                        let token = jwt.sign({ currentIndex: currentIndex, questions: questions, score: score }, JWT_SECRET);
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
                            return res.send("Game over");
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
                    return res.send("finish");
                }
            }
        }
    }
}

module.exports = { playController };