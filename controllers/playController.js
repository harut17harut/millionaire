let { dashController } = require("../controllers/dashController");
let scoresModel = require("../models/index").scores;
let userModel = require("../models/index").user;
const jwt = require('jsonwebtoken');
let fs = require("fs");

class playController {
    static play = async (req, res) => {
        //Take authorization token
        let { JWT_SECRET } = process.env;
        let authorization = req.body.authorization.split(".")[0];
        //Check if ./gamestats dir  exists
        if (!fs.existsSync(__dirname + "/../gamestats/")) {
            fs.mkdirSync(__dirname + "/../gamestats/")
        }
        //Check if {authorization}.txt exists,that file is for saving current game state
        let fileExists = fs.existsSync(__dirname + "/../gamestats/" + authorization + ".txt");
        if (!fileExists) {
            let questions = await dashController.getAllQuestRandom();//get Random questions
            //Initial values
            let currentIndex = 0;
            let score = 0;
            let hint50 = 1;
            let question = questions[currentIndex];
            question.answers = JSON.parse(question.answers);//parse answers array
            let token = jwt.sign({ currentIndex: currentIndex, questions: questions, score: score, hint50 }, JWT_SECRET);//save data in jwt token
            fs.writeFileSync(__dirname + "/../gamestats/" + authorization + ".txt", token);//write token in the file
            return res.json({ welcome: `Welcome to millionaire,you have ${hint50} 50/50  help`, question: question.question, answers: question.answers });
        }
        //This block works after first request
        else {
            let { userId, username } = req.body;
            let token = fs.readFileSync(__dirname + "/../gamestats/" + authorization + ".txt", "utf-8");//take data 
            let data;
            let err;
            //check does token valid
            jwt.verify(token, JWT_SECRET, (error, decoded) => {
                if (error) {
                    err = "Token has expirerd";
                    return;
                }
                else {
                    data = decoded;
                }
            });
            //delete file if something wents wrong
            if (err) {
                fs.unlinkSync(__dirname + "/../gamestats/" + authorization + ".txt")
                return res.status(403).json({ message: err });
            }

            let currentIndex = data.currentIndex;
            let questions = data.questions;
            let score = data.score;
            let question = questions[currentIndex];
            let hint50 = data.hint50;
            //check does user uses hint
            if (req.body.hint) {
                if (req.body.hint == "50/50") {
                    //check does user have hints
                    if (hint50 == 0) {
                        return res.json({ message: "You have no 50/50 hint avilable" });
                    } else {
                        if (req.body.answer) {
                            return res.json({ message: "please delete answer before using hint" });
                        }
                        question.answers = JSON.parse(JSON.stringify(question.answers));
                        let answers = playController.help50(question.answers, question.correct);//use 50/50 action
                        hint50--;
                        let token = jwt.sign({ currentIndex: currentIndex, questions: questions, score: score, hint50 }, JWT_SECRET);//save current stats
                        fs.writeFileSync(__dirname + "/../gamestats/" + authorization + ".txt", token);//write new data in file
                        return res.json({ question: question.question, answers: answers });
                    }
                }
            }
            //Check does questions over
            if (currentIndex < questions.length - 1) {
                let { answer } = req.body;
                if (!answer) {
                    return res.send("Please fill answer field [1-4]")
                }
                try {
                    //check does player given answer right
                    if (answer == question.correct + 1) {
                        score++;
                        currentIndex = data.currentIndex + 1;
                        let token = jwt.sign({ currentIndex: currentIndex, questions: questions, score: score, hint50 }, JWT_SECRET);
                        fs.writeFileSync(__dirname + "/../gamestats/" + authorization + ".txt", token);
                        question = questions[currentIndex];
                        question.answers = JSON.parse(question.answers);
                        return res.json({ question: question.question, answers: question.answers });
                    }
                    //Game over
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
            //Check does Player win the game
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
    //50/50 hint action replaces 2 wrong variant with "Wrong" word
    static help50 = function (answers, correct) {
        [answers[correct], answers[3]] = [answers[3], answers[correct]];
        answers[0] = "Wrong";
        answers[1] = "Wrong";
        [answers[correct], answers[3]] = [answers[3], answers[correct]];
        return answers;
    }
    //Get active users score
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
    //Get best game scores
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