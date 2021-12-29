let express = require('express');
let router = require("./routes/index")
require("dotenv").config();

let {HOST,PORT} = process.env;
let app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use("/",router);
app.listen(PORT,(err)=>{
    if(err) throw err;
console.log(`Server started at ${HOST}:${PORT}`);
});