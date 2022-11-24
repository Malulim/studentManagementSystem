const express = require("express");
const app = express();
const {engine} = require("express-handlebars");
const clientSessions = require("client-sessions");
const db_prep = require("./data/db_prep.js");
const bcrypt = require('bcrypt');

const HTTP_PORT = process.env.PORT || 8084;

app.engine(".hbs", engine({
    extname: ".hbs",
    defaultLayout: "main.hbs"
}));
app.set("view engine", ".hbs");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(clientSessions({
    cookieName:"userCookies", 
    secret: "secret", 
    duration: 2 * 60 * 1000, 
    activeDuration: 60 * 1000
}));

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res)=>{
   res.render("register_login",{layout:false});
});
app.get('/login',(req,res)=>{
    res.render("login",{layout:false});
})
app.get('/register',(req,res)=>{
    res.render('register',{layout:false});
})
app.post('/register',(req,res)=>{
    var user = {
        uName: req.body.uName,
        pswd: req.body.pswd
    };
    db_prep.createUser(user)
    .catch
})
app.post("/login", (req, res)=>{
    const uName = req.body.uName;
    const pswd = req.body.pswd;
   
    if (uName.trim().length == 0 || pswd.trim().length == 0)
    {
        res.render("login", {errorMsg: "Missing Credentials", layout:false});
    } 
    else if (uName === userDB.uName && req.body.pswd === userDB.pswd)
    {
        req.userCookies.userExample = {
            uName: userDB.uName
        };
        res.redirect("/home");
    }
    else {
        res.render("login", {errorMsg: "Invalid username or password.", layout:false});
    }
});

function ensureLogin(req, res, next)
{
    if (!req.userCookies.userExample) res.redirect("/login");
    else next();
}

app.get("/home", ensureLogin, (req, res)=>{
    res.render("home", {user: req.userCookies.userExample});
});

app.get("/logout", (req, res)=>{
    req.userCookies.reset();
    res.redirect("/");
});
app.get('/cs', ensureLogin, (req, res) => {
    db_prep.cs().then((data) => {
        res.render("viewData", { data: data });
    })
        .catch((reason) => {
            res.send(reason);
        })
});
app.get('/ee', ensureLogin, (req, res) => {
    db_prep.ee().then((data) => {
        res.render("viewData", { data: data });
    })
        .catch((reason) => {
            res.send(reason);
        })
});
app.get('/highGPA', ensureLogin, (req, res) => {
    db_prep.highGPA().then((data) => {
        res.json(data);
    })
        .catch((reason) => {
            res.send(reason);
        })
});
app.get("*", (req, res)=>{
    res.status(404).send("Error: page not found.");
});

db_prep.prep().then((data) => {
    app.listen(HTTP_PORT, onHttpStart);
})
    .catch((message) => {
        console.log(message);
    }
);
