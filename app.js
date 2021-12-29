let express = require('express');
let {authRouter} = require("./routes")
require("dotenv").config();

let {HOST,PORT} = process.env;
let app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use('/auth',authRouter);
app.listen(PORT,(err)=>{
    if(err) throw err;
console.log(`Server started at ${HOST}:${PORT}`);
});