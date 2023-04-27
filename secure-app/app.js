const client = require('./databasepg.js');
const express = require('express');
var bodyParser = require('body-parser')
const app = express();
var routes = require('./routes/routes.js');
const path = require('path');
const user = require("./routes/users");


app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.listen(3000, ()=>{
    console.log("Server is now listening at port 3000");
})

client.connect((err) => { //Connected Database

    if (err) {
    console.log(err);
    } else {
    console.log("Data logging initiated!");}
    
});

app.get('/users', (req,res)=>{
    client.query(`SELECT * FROM accounts`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})



app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', user);