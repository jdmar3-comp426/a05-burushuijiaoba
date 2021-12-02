// Define app using express
const express = require('express');
const app = express();
// Require database SCRIPT file
var db = require("./database.js")
// Make Express use its own built-in body parser
// Start server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const HTTP_PORT = 3480;
app.listen(HTTP_PORT, () => {
    console.log(`This app is listening on port ${HTTP_PORT}`)
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
  });

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post("/signup", (req, res) => {

    const userRecord = db.prepare("SELECT EXISTS(SELECT 1 from userinfo where user = ? or email = ?)").get(req.body.username,req.body.email);
	if(userRecord['EXISTS(SELECT 1 from userinfo where user = ? or email = ?)']==1){
        res.sendFile(__dirname + '/alreadyExists.html');
    }
    else{
        const stmt = db.prepare("INSERT INTO userinfo (user, pass, email) VALUES (?,?,?)");
        const info = stmt.run(req.body.username, req.body.password, req.body.email);
        res.sendFile(__dirname + '/login.html');
    }
});

app.post("/login", (req, res) => {
    console.log(req.body.username+" "+req.body.pass);
    const confirmInfo = db.prepare("SELECT EXISTS(SELECT 1 from userinfo where user = ? and pass = ?)").get(req.body.username,req.body.password);
    console.log(confirmInfo);
	if(confirmInfo['EXISTS(SELECT 1 from userinfo where user = ? and pass = ?)']==1){
        res.sendFile(__dirname + '/game.html');
    }
    else{
        res.sendFile(__dirname + '/wrongInformation.html');
    }
});

app.use(function(req, res){
	res.json({"message":"Endpoint not found. (404)"});
    res.status(404);
});